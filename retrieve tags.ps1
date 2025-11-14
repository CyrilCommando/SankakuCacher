# Script to rename files based on tags retrieved from Sankaku
# Pass the directory and your Sankaku Cookie
# Files all have to be named what they were named before the tag naming function was implemented (MD5)

# tooltip url https://chan.sankakucomplex.com/posts/${postID}?variant=tooltip&preview=false
# not used because tooltip doesn't have date

param (
    [string]$inputDirectory,
    [string]$cookie,
    [string]$maxArtistTags = 1,
    [string]$maxCharacterTags = 3,
    [string]$maxIpTags = 1,
    [bool]$includeDate = $true
)

if ($inputDirectory -eq $null -or $inputDirectory -eq "") {
    Write-Host "Please provide a valid input directory."
    exit
}

# Import the required module
Add-Type -AssemblyName System.Net.Http

$fileName = ""

# Function to retrieve and parse HTML for elements with class "tag-type-artist"
$request_headers = @{
    "User-Agent"                = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0"
    "Accept"                    = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    "Accept-Language"           = "en-US,en;q=0.5"
    "Accept-Encoding"           = "none"
    "DNT"                       = "1"
    "Sec-GPC"                   = "1"
    "Connection"                = "keep-alive"
    "Upgrade-Insecure-Requests" = "1"
    "Sec-Fetch-Dest"            = "document"
    "Sec-Fetch-Mode"            = "navigate"
    "Sec-Fetch-Site"            = "none"
    "Sec-Fetch-User"            = "?1"
    "Priority"                  = "u=0, i"
    "Cookie"                    = $cookie
    
    "Cache-Control"             = "no-cache"
    "Pragma"                    = "no-cache"

}

foreach ($file in Get-ChildItem -Path $inputDirectory -File) {
    if ([System.IO.Path]::GetFileNameWithoutExtension($file.FullName) -match "^[a-fA-F0-9]{32}$") {
        Write-Host "Processing file: $($file.FullName)"
    }
    else {
        Write-Host "Skipping file (not a valid MD5 hash): $($file.FullName)"
        continue
    }
    try {
        $placeholder = [System.IO.Path]::GetFileNameWithoutExtension($file.FullName)
        $url = "https://chan.sankakucomplex.com/posts.html?tags=md5:$placeholder+&auto_page=t&page=1"
        # Create an HttpClient to fetch the HTML content
        $httpClient = New-Object System.Net.Http.HttpClient
        foreach ($header in $request_headers.GetEnumerator()) {
            $httpClient.DefaultRequestHeaders.Add($header.Key, $header.Value)
        }
    
        Start-Sleep -Seconds 2
        $response = $httpClient.GetStringAsync($url).Result

        # Load the HTML content into an HtmlDocument
        $HTML = New-Object -ComObject "HTMLFile"

        try {
            # This works in PowerShell with Office installed
            $HTML.IHTMLDocument2_write($response)
        }
        catch {
            # This works when Office is not installed    
            $src = [System.Text.Encoding]::Unicode.GetBytes($response)
            $HTML.write($src)
            # Write-Host $HTML.body.innerHTML
        }

        $postUrl = $HTML.getElementsByTagName("*") | Where-Object {
            $_.className -eq "post-preview-link"
        }

        $postID = $postUrl.href.Substring(16)

        $nUrl = "https://chan.sankakucomplex.com/en/posts/$postID"

        Start-Sleep -Seconds 2

        $response = $httpClient.GetStringAsync($nUrl).Result

        # Load the HTML content into an HtmlDocument
        $HTML = New-Object -ComObject "HTMLFile"

        try {
            # This works in PowerShell with Office installed
            $HTML.IHTMLDocument2_write($response)
        }
        catch {
            # This works when Office is not installed    
            $src = [System.Text.Encoding]::Unicode.GetBytes($response)
            $HTML.write($src)
            # Write-Host $HTML.body.innerHTML
        }

        if ($includeDate) {
            $dateTaken = $HTML.getElementById("stats").childNodes.item(5).innerText.Substring(0,10)
            $fileName += "$dateTaken "
        }

        # Find all elements with the class "tag-type-artist"
        $elementsArtist = $HTML.getElementsByTagName("*") | Where-Object {
            $_.className -eq "tag-type-artist"
        } | Select-Object -First $maxArtistTags

        $elementsCharacter = $HTML.getElementsByTagName("*") | Where-Object {
            $_.className -eq "tag-type-character"
        } | Select-Object -First $maxCharacterTags

        $elementsCopyright = $HTML.getElementsByTagName("*") | Where-Object {
            $_.className -eq "tag-type-copyright"
        } | Select-Object -First $maxIpTags

        # Concatenate their innerHTML property to $fileName
        foreach ($element in $elementsArtist) {
            $fileName += $element.childNodes.item(0).innerText + " "
        }

        foreach ($element in $elementsCharacter) {
            $fileName += $element.childNodes.item(0).innerText + " "
        }

        foreach ($element in $elementsCopyright) {
            $fileName += $element.childNodes.item(0).innerText + " "
        }

        Write-Host $fileName

        # Output the elements
        # foreach ($element in $elements) {
        #     Write-Output $element.outerHTML
        # }
    }
    catch {
        Write-Host "An error occurred: $_"
        $fileName = ""
        continue
    }

    $fileName = $fileName -replace '[\\\/:\*\?"<>\|]', ''
    $fileName += [System.IO.Path]::GetFileNameWithoutExtension($file.FullName) + [System.IO.Path]::GetExtension($file.FullName)
    $newFilePath = Join-Path -Path $file.DirectoryName -ChildPath $fileName
    Rename-Item -Path $file.FullName -NewName $newFilePath
    $fileName = ""
}