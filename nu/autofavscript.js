customfavfunction = function() {

    var post_id;

    getpostid();

    Favorite.create(post_id)


    
    getpostid = function()
    {
        post_id = document.getElementById("post-view").closest("span").innerText();
        alert(post_id)
    }
}






customfavfunction = function()
{
    var post_id = document.getElementById("post-view").firstChild.nextSibling.innerText; Favorite.create(post_id); 
} 

