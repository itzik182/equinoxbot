          bot.sendMessage(senderId, 
            { 
              attachment : {
                type : 'template',
                payload : {
                  template_type : 'generic',
                  elements : [
                    {
                      title : article.title,
                      // image_url : article.urlToImage,
                      // subtitle : article.description,
                      // default_action : {
                      //   type : 'web_url',
                      //   url : article.url,
                      //   messenger_extensions : true,
                      //   webview_height_ratio : 'tall',
                      //   fallback_url : 'https://news.ycombinator.com/'
                      // }
                    }
                  ]
                }
              }
            }
         ) 
            