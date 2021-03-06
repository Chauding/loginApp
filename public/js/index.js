var Index = function() {};
Index.load = function(){
    $('#instaColumn').hide().delay( 10000 ).transition('scale');
    $('#redditContainer').hide().delay( 10000 ).transition('scale');
    $(".ui.search").removeClass('lab-hidden');
      $('.ui.dropdown').dropdown();
      $('.ui.menu .item').tab();
      $(".header-search .prompt").keyup(function(event){
        if (event.keyCode === 13) {
          var requestData = {
            search: $(".header-search .prompt").val()
          }
          $.ajax({
             url: "/",
             method: "POST",
             data: requestData,
             success: function(response) {
               $('.twitterColumn').empty();
               $('.twitterColumn').html(response);
               $('#twitterColumn').transition('pulse');

            },
            error: function(data) {
              console.log('NO');
            }
          })
          //This is for the previous method to call twitter
          // Index.newRender();
          Index.getRedditResults(requestData.search);
        }
      });
}
Index.register = function (){
    $(".ui.search").addClass('lab-hidden');
    $('.ui.dropdown').dropdown();
}
Index.newRender = function () {
  // takes the value inside the serach bar
  var searchTerm = $(".header-search .prompt").val();
  //puts the value above and sets it to be a variable in the url
   window.location.href = 'http://localhost:8080/?q=' + searchTerm;
}
Index.getTwitterResults = function (requestData) {

}
Index.getRedditResults =  function (requestData) {
  // empties the container to reload new data
  $('.redditColumn').empty();
  $('.redditColumn').append('<div class="ui active inverted dimmer" style="background-color:#ebebeb"> <div class="ui text loader">Loading</div></div>');
  console.log(requestData);
  var url = "https://www.reddit.com/search.json?q="+ requestData;
  $.getJSON(url, function foo(data) {
        //for every entry in the data array, not you must look at the raw json from the api you are using.
        //Every json stream is different with different elements.
        $('.redditColumn').empty();
        $.each(
            //get the first 10 children (ie first ten posts)
            data.data.children.slice(0, 20),
            function (i, post) {
              // too see what data is coming down
              console.log(post.data);
                //create a new article for every item
                //for every item get the parts we want and append it to the new article
                var item = $(document.createElement('div'))
                .append('<div class="ui fluid centered card"><div class="left aligned content"><div class="right floated meta">' +
                post.data.subreddit_name_prefixed + '</div><img class="ui avatar image" src="../images/rprofile3.png">' +
                post.data.author  +'<div class="ui inverted divider"></div>' +
                post.data.title +'</div> <div class="ui inverted divider"></div><a href="https://reddit.com'+ post.data.permalink+'" target="_blank">See Comment Section</a> <p><span class="up"> <i class="grey arrow up icon"></i>' +
                post.data.ups + '</span><span class="down"> <i class="grey arrow down icon"></i>'+
                post.data.downs+'</span></p>');
                $(item).addClass('item ui segment');//add the item class so the css picks it up
                $('.redditColumn').append(item);//append the item to the main content

            }
        )
      $('#redditContainer').transition('pulse');
    });
}
Index.getInstagramResults = function () {
  // instargram failed to work as we couldn't get authentication
  var token = '12930071.4771b68.7c3097a46b484a63aaf31632aca9cb65',
  client_id = '4771b68ebdf449589e2ea82b6b398d33',
  redirect_uri ='https://elfsight.com/service/generate-instagram-access-token/',
  hashtag='wordcamprussia2015', // hashtag without # symbol
  num_photos = 4;
  $.ajax({
    // url: 'https://api.instagram.com/v1/tags/'+ hashtag +'/media/recent?access_token='+token+'&scope=public_content',
    // url: 'https://api.instagram.com/v1/tags/' + hashtag + '/media/recent',
    url: 'https://api.instagram.com/oauth/authorize/?client_id=' + client_id + '&redirect_uri=' + redirect_uri + '&response_type=code',
    dataType: 'jsonp',
    type: 'GET',
    data: {access_token: token, count: num_photos},
    success: function(data){
      console.log(data);
      for(x in data.data){
        $('#ul').append('<li><img src="'+data.data[x].images.standard_resolution.url+'"></li>');
      }
    },
    error: function(data){
      console.log(data);
    }
  });
}
Index.settings = function (){
  $(".ui.search").addClass('lab-hidden');
  $('.ui.dropdown').dropdown();
  $('.editButton').on('click', function(){
    $('.ui.form .field').removeClass('disabled');
    $('.editButton').addClass('lab-hidden');
    $('.saveButton').removeClass('lab-hidden');
    $('.CancelButton').removeClass('lab-hidden');
  })
  $('.CancelButton').on('click', function(){
    $('.ui.form .field').addClass('disabled');
    $('.CancelButton').addClass('lab-hidden');
    $('.saveButton').addClass('lab-hidden');
    $('.editButton').removeClass('lab-hidden');
  })
}
