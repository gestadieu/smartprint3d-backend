  $(document).ready(function () {
    $('body').bootstrapMaterialDesign();
    $('[data-toggle="popover"]').popover();

    // const dataHTML = nunjucks.render('nav.html', {
    //   data: {}
    // });
    // document.getElementById('nav').innerHTML = dataHTML;
  });

  // get all surveys
  // async function getAll(query) {
  //   const response = await fetch('api');
  //   const data = await response.json();

  //   // display with the template
  //   // Transparency.render(document.getElementById('cards'), data);
  //   // document.getElementById('count').textContent = data.count;
  //   const dataHTML = nunjucks.render('cards.html', {
  //     data: data
  //   });
  //   console.log(data);
  //   document.getElementById('cards').innerHTML = dataHTML;
  // }


  $.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
      if (o[this.name]) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });
    return o;
  };

  // create a new survey
  $("#survey").submit(async event => {
    event.preventDefault();

    const data = $('#survey').serializeObject();

    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    const response = await fetch('/api', options);
    const json = await response.json();
    $(location).attr('href', '/');
  });

  // get Navigation menu
  // async function getNav(tpl) {
  //   const response = await fetch('/templates/nav.html');
  //   const html = await response.text();
  //   document.getElementById('nav').innerHTML = html;
  // }
  // getNav();