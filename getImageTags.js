function getImageTags(docu)
{
  var charactertags = Array.prototype.slice.call(docu.getElementById("tag-sidebar").getElementsByClassName("tag-type-character"))
  var seriestags = Array.prototype.slice.call(docu.getElementById("tag-sidebar").getElementsByClassName("tag-type-copyright"))
  var artisttags = Array.prototype.slice.call(docu.getElementById("tag-sidebar").getElementsByClassName("tag-type-artist"))
  var genretags = Array.prototype.slice.call(docu.getElementById("tag-sidebar").getElementsByClassName("tag-type-genre"))
  var studiotags = Array.prototype.slice.call(docu.getElementById("tag-sidebar").getElementsByClassName("tag-type-studio"))
  var metadatatags = Array.prototype.slice.call(docu.getElementById("tag-sidebar").getElementsByClassName("tag-type-medium"))
  var generaltags = Array.prototype.slice.call(docu.getElementById("tag-sidebar").getElementsByClassName("tag-type-general"))
  var tag_array = [];
  charactertags.forEach(element => {
    tag_array.push ({"type": "character_tag", "tag": $(element).find("a").text().slice (0)})
  });
  seriestags.forEach(element => {
    tag_array.push ({"type": "copyright_tag", "tag": $(element).find("a").text().slice (0)})
  });
  artisttags.forEach(element => {
    tag_array.push ({"type": "artist_tag", "tag": $(element).find("a").text().slice (0)})
  });
  genretags.forEach(element => {
    tag_array.push ({"type": "genre_tag", "tag": $(element).find("a").text().slice (0)})
  });
  studiotags.forEach(element => {
    tag_array.push ({"type": "studio_tag", "tag": $(element).find("a").text().slice (0)})
  });
  metadatatags.forEach(element => {
    // if ($(element).find("a").text().slice (0, -1).match("^animated"))
    // {
      tag_array.push ({"type": "metadata_tag", "tag": $(element).find("a").text().slice (0)})
    // }
  });
  generaltags.forEach(element => {
    tag_array.push ({"type": "general_tag", "tag": $(element).find("a").text().slice (0)})
  });
  tag_array.forEach(element => {
    element.tag = element.tag.replace(/ /g, "_")
  });
  return tag_array
}