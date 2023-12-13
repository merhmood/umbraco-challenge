(function () {
  window.addEventListener('DOMContentLoaded', () => {
    if (location.pathname == '/') {
      (function fetchData(renderStories) {
        // Handles the application data fetching logic
        fetch(
          '/umbraco/delivery/api/v1/content/item/fbc5729a-ba33-4268-bd82-d917136f2167'
        )
          .then((data) => data.json())
          .then((data) => renderStories(data.properties.stories.items));
      })(renderStories);

      // render stories to page
      let start = 6; // starting point for adding more stories
      let end = 9; // ending point for adding more stories
      function renderStories(stories) {
        const loadMore = document.getElementById('load-more');
        const homeStories = document.querySelector('.stories-items');
        loadMore.addEventListener('click', () => {
          for (let i = start; i < end; i++) {
            // Nodes creation
            const story = document.createElement('div');
            const attributeTag = document.createElement('a');
            const image = document.createElement('img');
            const texts = document.createElement('div');
            const date = document.createElement('p');
            const title = document.createElement('h2');
            const excerpt = document.createElement('p');

            // Attribute and event attachments
            image.src =
              stories[i]?.content?.properties?.storyBackgroundImage[0]?.url;
            date.innerHTML = parseDate(
              stories[i]?.content?.properties?.storyDate
            );
            title.innerHTML = stories[i]?.content?.properties?.storyTitle;
            excerpt.innerHTML = stories[i]?.content?.properties?.storyExcerpt;

            attributeTag.addEventListener('click', () => {
              onStoryClick(image.src, date.textContent, title.textContent);
            });

            // Style attachments
            story.className = 'story';
            texts.className = 'texts';
            date.className = 'date';
            title.className = 'title';
            excerpt.className = 'excerpt';

            // child node attachments
            texts.appendChild(date);
            texts.appendChild(title);
            texts.appendChild(excerpt);
            attributeTag.appendChild(image);
            attributeTag.appendChild(texts);
            story.appendChild(attributeTag);

            homeStories.appendChild(story);

            // Logic below removes read more button
            if (i === stories.length - 1) {
              loadMore.remove();
            }
          }
          start = start + 3 <= stories.length ? start + 3 : stories.length;
          end = end + 3 <= stories.length ? end + 3 : stories.length;
        });

        // Converts date to Jul 5 format and stripes aways any
        // unwanted property.
        function parseDate(date) {
          const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ];
          const splitDateString = date.split('T')[0].split('-');
          const day = parseSplitDateString(splitDateString, 2);
          const month = parseSplitDateString(splitDateString, 1);
          return `${months[month - 1]} ${day}`;
        }

        function parseSplitDateString(string, index) {
          return string[index][0] == 0 ? string[index][1] : string[index];
        }
      }

      (function () {
        const stories = document.querySelectorAll('.story');
        stories.forEach((element) => {
          element.children[0].addEventListener('click', () => {
            const image = element.children[0].children[0].src;
            const date =
              element.children[0].children[1].children[0].textContent;
            const title =
              element.children[0].children[1].children[1].textContent;
            onStoryClick(image, date, title);
          });
        });
      })();
    }
    function onStoryClick(image, date, title) {
      // This handles setting the localstorage value which we will access
      // in the community detail page and set the properties that we to
      // be dynamic.
      localStorage.setItem('story', JSON.stringify({ image, date, title }));
      setTimeout(() => (location.href = '/community-detail'), 20);
    }

    (function () {
      if (location.pathname === '/community-detail') {
        const banner = document.querySelector('.banner');
        const story = JSON.parse(localStorage.getItem('story'));
        const image = banner.children[0];
        const title = banner.children[1].children[0].children[0];

        // Sets value
        image.src = story.image;
        title.innerHTML = story.title;
      }
    })();
  });
})();
