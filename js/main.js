(function () {
    'use strict';

    // Smooth Scroll
    var scrollSmooth = (function () {
      $(document).on("click", "a[href^=\"#\"]", function (event) {
        event.preventDefault();
        $("html, body").animate({
          scrollTop: $($.attr(this, "href")).offset().top - 70
        }, 500);
      });
    });
    
    scrollSmooth();

    // Burger Menu
    var burgerBtn = document.querySelector('.nav__toggle'),
        nav = document.querySelector('.nav__list');

    burgerBtn.addEventListener('click', function () {
      toggleActive(this);
      toggleActive(nav);
    });

    nav.addEventListener('click', function () {
      if(this.classList.contains('active')) {
        this.classList.remove('active');
        burgerBtn.classList.remove('active');
      }
    });

    // Toggle Active
    function toggleActive(elem) {
      elem.classList.contains('active') ? elem.classList.remove('active') : elem.classList.add('active');
    }
    
    // Order Form
    var Submit = (function () {
      var errorMessages = {
        phone: {
          regExp: /[0-9+()-\s]{5,}/,
          empty: "Номер телефона обязателен",
          notValid: "Некорректный номер телефона",
        },
        nickname: {
          regExp: /^\S*$/,
          empty: "Логин обязателен",
          notValid: "Некорректный логин",
        },
      };
      var form = $(".registration_form");
      var inputLocation = $(".js-input-location");
      return {
        submitHandler: function submitHandler() {
          form.submit(function (e) {
            e.preventDefault();
            $(".form_error").remove();
            $(".form__wrap-input").removeClass("error");
            var errorFields = Submit.validateForm(form);
    
            if (errorFields.length) {
              Submit.showErrorFields(errorFields);
            } else {
              inputLocation.val("healthyproducts.space");
              $(".js-loader").addClass("progress");
              $.ajax({
                url: "https://api.apispreadsheets.com/data/18475/",
                type: "POST",
                contentType: false,
                processData: false,
                data: new FormData(this),
                success: function success() {
                  $(".js-loader").removeClass("progress");
    
                  $(".registration_form").hide();
                  $(".feedback").addClass("sent");
                  $(".popup__success").show();
                },
                error: function () {
                  alert("error");
                },
              });
            }
          });
        },
        showErrorFields: function showErrorFields(errorFields) {
          for (var i = 0; i < errorFields.length; i++) {
            var _errorFields$i = errorFields[i],
              name = _errorFields$i.name,
              msg = _errorFields$i.msg;
            var field = $("[name=".concat(name, "]"));
            field
              .parents(".form__wrap-input")
              .addClass("error")
              .append('<div class="form_error"> '.concat(msg, "</div >"));
          }
        },
        validateInput: function validateInput(input) {
          if (!input.length) {
            return false;
          }
    
          var error = "";
          var value = input.val();
          var name = input.attr("name");
    
          if (!errorMessages[name]) {
            return false;
          }
          var _errorMessages$name = errorMessages[name],
            regExp = _errorMessages$name.regExp,
            empty = _errorMessages$name.empty,
            notValid = _errorMessages$name.notValid;
    
          if (value.length < 1) {
            error = empty;
          } else {
            var isValid = regExp.test(value);
    
            if (!isValid) {
              error = notValid;
            }
          }
    
          return error;
        },
        validateForm: function validateForm(form) {
          var inputs = form.find(".js-input");
          var errors = [];
          var validGroups = [];
    
          for (var i = 0; i < inputs.length; i++) {
            var input = $(inputs[i]);
            var name = input.attr("name");
            var group = "";
    
            if (errorMessages[name]) {
              group = errorMessages[name].group;
            }
    
            var error = Submit.validateInput(input);
    
            if (error) {
              if (group) {
                errors.push({
                  name: name,
                  msg: error,
                  group: group,
                });
              } else {
                errors.push({
                  name: name,
                  msg: error,
                });
              }
            } else {
              if (group && validGroups.indexOf(group) === -1) {
                validGroups.push(group);
              }
            }
          }
    
          var filteredErrors = errors.filter(function (error) {
            var group = error.group;
    
            if (!group) {
              return error;
            } else {
              if (validGroups.indexOf(group) !== -1) {
                return false;
              } else {
                return error;
              }
            }
          });
          return filteredErrors;
        },
        init: function init() {
          Submit.submitHandler();
        },
      };
    })();
    
    Submit.init();
  

    function main() {
      // Reviews Slider https://kenwheeler.github.io/slick/
      $('.reviews__list').slick({
        infinite: true,
        slidesToShow: 2,
        slidesToScroll: 2,
        responsive: [{
          breakpoint: 640,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            adaptiveHeight: true,
            infinite: true
          }
        }]
      }); 
      
      // Accordiaon
      $(".questions__list-text").on('click', function () {
        if($(".questions__list-text").not(this).hasClass('active')) {
          $(".questions__list-text").not(this).removeClass('active');
          $(".questions__list-text").not(this).next().slideUp();
        }
        $(this).toggleClass('active');
        $(this).next().slideToggle();
      }); 
    }

    // Lazy Loading
    if (document.documentElement.clientWidth < 480) {
      window.addEventListener('scroll', function () {
        return setTimeout(main, 1000);
      }, {
        once: true
      });
    } else {
      main();
    }

}());