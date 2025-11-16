function getArrayOfFormattedTagStrings(tag_array) {
    //character tags
    var chartag = "";
    var ctlimit = 0;
    tag_array.forEach(tag => {
        if ((tag.type == "character_tag") && (ctlimit < parseInt($("#character_tag_limit").val()))) {
            chartag = chartag.concat(tag.tag + " ")
            ctlimit++
        }
    });
    chartag = chartag.trimEnd()
    chartag = chartag.replaceAll(":", "_")
    //end character tags

    //artist tags
    var artisttag = "";
    var atlimit = 0;
    tag_array.forEach(tag => {
        if ((tag.type == "artist_tag") && (atlimit < parseInt($("#artist_tag_limit").val()))) {
            artisttag = artisttag.concat(tag.tag + " ")
            atlimit++
        }
    });
    artisttag = artisttag.trimEnd()
    artisttag = artisttag.replaceAll(":", "_")
    //end artist tags

    //IP tags
    var iptag = "";
    var iplimit = 0;
    tag_array.forEach(tag => {
        if ((tag.type == "copyright_tag") && (iplimit < parseInt($("#ip_tag_limit").val()))) {
            iptag = iptag.concat(tag.tag + " ")
            iplimit++
        }
    });
    iptag = iptag.trimEnd()
    iptag = iptag.replaceAll(":", "_")
    //end IP tags
    return [chartag, artisttag, iptag];
}