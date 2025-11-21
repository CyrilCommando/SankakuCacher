//the version we use bc service workers don't support background pages

function getImageTagsFromDocument(htmlString) {
  if (typeof htmlString !== "string") {
    throw new Error("Invalid input: htmlString must be a string.");
  }

  // Helper function to extract tags of a specific type
  function extractTags(html, className) {
    const regex = new RegExp(
      `(<li class="${className}"> <a [\\s\\S]{0,200}>)([\\s\\S]{0,100})(<\/a> <\/li>)`,
      "gi"
    );
    const tags = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      tags.push(match[2].trim());
    }
    return tags;
  }

  // Extract tags for each type
  const charactertags = extractTags(htmlString, "tag-type-character");
  const seriestags = extractTags(htmlString, "tag-type-copyright");
  const artisttags = extractTags(htmlString, "tag-type-artist");
  const genretags = extractTags(htmlString, "tag-type-genre");
  const studiotags = extractTags(htmlString, "tag-type-studio");
  const metadatatags = extractTags(htmlString, "tag-type-medium");
  const generaltags = extractTags(htmlString, "tag-type-general");

  // Combine all tags into a single array with their types
  const tag_array = [];

  charactertags.forEach(tag => tag_array.push({ type: "character_tag", tag }));
  seriestags.forEach(tag => tag_array.push({ type: "copyright_tag", tag }));
  artisttags.forEach(tag => tag_array.push({ type: "artist_tag", tag }));
  genretags.forEach(tag => tag_array.push({ type: "genre_tag", tag }));
  studiotags.forEach(tag => tag_array.push({ type: "studio_tag", tag }));
  metadatatags.forEach(tag => tag_array.push({ type: "metadata_tag", tag }));
  generaltags.forEach(tag => tag_array.push({ type: "general_tag", tag }));

  // Sanitize tags
  tag_array.forEach(element => {
    element.tag = element.tag
      .replace(/ /g, "_")
      .replace(/\?/g, "_")
      .replace(/["\/><\\:*|]/g, "_");
  });

  return tag_array;
}