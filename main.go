package main

import (
	"fmt"
	"math"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strings"
	"sync"
)

var supportedImageFiles = []string{
	"JPEG",
	"GIF",
	"PNG",
	"SVG",
	"WEBP",
}

func main() {
	root := os.Args[1]
	imageList := makeImageList(root, env2fileList(root, os.Getenv("IGNORED_FILES")))
	if len(imageList) == 0 {
		fmt.Println("there is no image files")
		os.Exit(0)
	}

	pullRequestMessage := []string{
		"[imgcmp] Optimize images",
		"",
		"## Successfully optimized",
	}
	reportTable := []string{
		"<details>",
		"",
		"<summary>details</summary>",
		"",
		"|File Name|Before|After|Diff (size)|Diff (rate)|",
		"|:---|---:|---:|---:|---:|",
	}

	var (
		totalBeforeSize int64 = 0
		totalAfterSize  int64 = 0
		wg                    = &sync.WaitGroup{}
		mutex                 = &sync.Mutex{}
	)
	// optimize images and make reportTable
	for _, path := range imageList {
		wg.Add(1)
		go func(p string) {
			defer wg.Done()
			beforeSize := fileSize(p)
			optimizeImage(p)
			afterSize := fileSize(p)
			mutex.Lock()
			reportTable = append(reportTable, tableRow(strings.Replace(p, root+"/", "", 1), beforeSize, afterSize))
			mutex.Unlock()
			totalBeforeSize += beforeSize
			totalAfterSize += afterSize
		}(path)
	}
	wg.Wait()

	// pull request
	if (totalBeforeSize - totalAfterSize) < 100 {
		fmt.Println("images are already optimized")
		os.Exit(0)
	} else {
		reportTable = append(reportTable, tableRow("Total", totalBeforeSize, totalAfterSize), "", "</details>")
		pullRequestMessage = append(
			pullRequestMessage,
			fmt.Sprintf(
				"Your image files have been optimized (File size: **%v** (**%v**))!",
				byte2unit(totalAfterSize-totalBeforeSize),
				diffRate(totalBeforeSize, totalAfterSize),
			),
			"",
		)
		file, err := os.Create("./pull_request_message.md")
		if err != nil {
			fmt.Println(err.Error())
			os.Exit(0)
		}
		defer file.Close()

		pullRequestMessage = append(pullRequestMessage, reportTable...)
		output := strings.Join(pullRequestMessage, "\n")
		file.Write(([]byte)(output))

		fmt.Println("Successfully optimized")
	}
}

func env2fileList(root string, env string) []string {
	fileList := []string{}
	fileListWildcard := strings.Split(env, ":")
	if env == "" {
		return fileList
	}
	for _, fileWildcard := range fileListWildcard {
		files, _ := filepath.Glob(root + "/" + fileWildcard)
		fileList = append(fileList, files...)
	}
	return fileList
}

func makeImageList(root string, ignoredFileList []string) []string {
	ignoredRegexp := regexp.MustCompile(strings.Join(ignoredFileList, "|"))
	if len(ignoredFileList) == 0 {
		// 0^ matches nothing
		ignoredRegexp = regexp.MustCompile("0^")
	}

	skipDirRegexp := regexp.MustCompile(`^\..+`)
	imageList := []string{}
	callback := func(path string, info os.FileInfo, err error) error {
		if info.IsDir() {
			if skipDirRegexp.MatchString(info.Name()) {
				return filepath.SkipDir
			}
			return nil
		}

		fileType := getFileType(path)
		isImageFile := false
		for _, supportedFileType := range supportedImageFiles {
			if supportedFileType == fileType {
				isImageFile = true
			}
		}
		if isImageFile && !ignoredRegexp.MatchString(path) {
			imageList = append(imageList, path)
		}
		return nil
	}
	err := filepath.Walk(root, callback)
	if err != nil {
		fmt.Println(1, err)
	}
	return imageList
}

func getFileType(path string) string {
	fileInfo := execCommand("file", []string{path})
	var imageFilePatterns = map[string]*regexp.Regexp{
		"JPEG": regexp.MustCompile("JPEG image data"),
		"GIF":  regexp.MustCompile("GIF image data"),
		"PNG":  regexp.MustCompile("PNG image data"),
		"SVG":  regexp.MustCompile("SVG image data"),
		"WEBP": regexp.MustCompile("Web/P image"),
	}
	for _, fileType := range supportedImageFiles {
		if imageFilePatterns[fileType].MatchString(fileInfo) {
			return fileType
		}
	}
	return "OTHER"
}

func optimizeImage(path string) {
	fileType := getFileType(path)
	if fileType == "JPEG" {
		execCommand("jpegoptim", []string{"-m85", path})
	} else if fileType == "PNG" {
		execCommand("optipng", []string{"-o2", path})
	} else if fileType == "GIF" {
		execCommand("gifsicle", []string{"-b", "-O3", "--colors", "256", path})
	} else if fileType == "SVG" {
		execCommand("svgo", []string{path})
	} else if fileType == "WEBP" {
		execCommand("cwebp", []string{"-q", "50", path, "-o", path})
	}
}

func execCommand(command string, args []string) string {
	output, err := exec.Command(command, args...).Output()
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}
	return string(output)
}

func fileSize(path string) int64 {
	file, errOpen := os.Open(path)
	if errOpen != nil {
		fmt.Println(errOpen.Error())
	}
	info, errStat := file.Stat()
	if errStat != nil {
		fmt.Println(errStat.Error())
	}
	return info.Size()
}

func byte2unit(size int64) string {
	var res string
	negative := size < 0
	size = int64(math.Abs(float64(size)))
	if size >= 1e9 {
		res = fmt.Sprintf("%.2f GB", float64(size)/1e9)
	} else if size >= 1e6 {
		res = fmt.Sprintf("%.2f MB", float64(size)/1e6)
	} else if size >= 1e3 {
		res = fmt.Sprintf("%.2f kB", float64(size)/1e3)
	} else {
		res = fmt.Sprintf("%v Byte", size)
	}
	if negative {
		res = "-" + res
	}
	return res
}

func diffRate(before int64, after int64) string {
	return fmt.Sprintf("%.2f", float64(after-before)/float64(before)*100) + "%"
}

func tableRow(name string, before int64, after int64) string {
	return fmt.Sprintf("|%v|%v|%v|%v|%v|", name, byte2unit(before), byte2unit(after), byte2unit(after-before), diffRate(before, after))
}
