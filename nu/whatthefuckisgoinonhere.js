var inc = 0;
result[x].list.forEach(em => {
  try {
    var split_strings_array = sb_text.split(/ +/)
    em.tags.forEach(tag => {
      for (let index = 0; index < split_strings_array.length; index++) {
        var element = split_strings_array[index];
        if (tag.tag.match("^("+element+")"))
        {
          inc ++
        }
      }
      if (inc == split_strings_array.length)
      {
        if(!excluded_items_array.list.includes(em))
        {
          excluded_items_array.list.push(em)
        }
      }