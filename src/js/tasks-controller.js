/**
 * @fileOverview We use the `module` pattern to ensure this `controller` can encapsulate data,
 * and expose a public API to the rest of the application.
 *
 * The controller will be responsible for initializing the form, handling events,
 * and managing any state required by the page.
 * Using an IIFE creates a `singleton`, this is required since the controller
 * manages our application's state (data & DOM manipulation)
 */

/**
 *
 * @type {{init: tasksController.init}}
 */
var tasksController = (function() {
  var taskPage
  var initialised = false

  return {
    init: function(page) {
      if (!initialised) {
        taskPage = page

        // setup ui element to specify required form fields
        $(taskPage)
          .find('[required="required"]')
          .prev("label")
          .append("<span>*</span>")
          .children("span")
          .addClass("required")

        // setup ui to make reading the table easier by coloring alternating rows
        $(taskPage)
          .find("tbody tr:even")
          .addClass("even")

        // setup click handler to display task creation form
        $(taskPage)
          .find("#btnAddTask")
          .click(function(evt) {
            evt.preventDefault()
            $(taskPage)
              .find("#taskCreation")
              .removeClass("not")
          })

        // setup click handler to highlight selected rows
        $(taskPage)
          .find("tbody tr")
          .click(function(evt) {
            $(evt.target)
              .closest("td")
              .siblings()
              .andSelf()
              .toggleClass("rowHighlight")
          })

        // setup click handler to delete rows
        $(taskPage)
          .find("#tblTasks tbody")
          .on("click", ".deleteRow", function(evt) {
            evt.preventDefault()
            $(evt.target)
              .parents("tr")
              .remove()
          })

        // setup click handler to save task using our jQuery form plugin
        $(taskPage)
          .find("#saveTask")
          .click(function(evt) {
            evt.preventDefault()
            if (
              $(taskPage)
                .find("form")
                .valid()
            ) {
              var task = $("form").toObject()
              $("#taskRow")
                .tmpl(task)
                .appendTo($(taskPage).find("#tblTasks tbody"))
            }
          })
        initialised = true
      }
    },
  }
})()
