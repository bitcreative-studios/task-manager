// requires: tasks-webstorage.js
/**
 * @fileOverview We use the `module` pattern to ensure this `controller` can encapsulate data,
 * and expose a public API to the rest of the application.
 *
 * The controller will be responsible for initializing the form, handling events,
 * and managing any state required by the page.
 * Using an IIFE creates a `singleton`, this is required since the controller
 * manages our application's state (data & DOM manipulation)
 *
 *
 */

/**
 *
 * @type {Object} TaskController
 * @property {Function} init Initialize the controller
 *
 */
var tasksController = (function() {
  // TODO: how to specify this of type ErrorCallback?
  /**
   *
   * @param {ErrorObject} error
   */
  function errorLogger(error) {
    console.log(`${error.code}: ${error.message}`)
  }

  var taskPage
  var initialised = false

  return {
    /**
     * @param {HTMLElement} page A reference to the DOM element this controller
     * should be attached to.
     */
    init: function(page) {
      storageEngine.init(function() {
        storageEngine.initObjectStore("task", function() {}, errorLogger)
      }, errorLogger)
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

        // setup click handler to edit row
        $(taskPage)
          .find("#tblTasks tbody")
          .on("click", ".editRow", function(evt) {
            $(taskPage)
              .find("#taskCreation")
              .removeClass("not")
            storageEngine.findById(
              "task",
              $(evt.target).data().taskId,
              function(task) {
                $(taskPage)
                  .find("form")
                  .fromObject(task)
              },
              errorLogger
            )
          })

        // setup click handler to delete row
        $(taskPage)
          .find("#tblTasks tbody")
          .on("click", ".deleteRow", function(evt) {
            storageEngine.delete(
              "task",
              $(evt.target).data().taskId,
              function() {
                $(evt.target)
                  .parents("tr")
                  .remove()
              },
              errorLogger
            )
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
              storageEngine.save(
                "task",
                task,
                function(savedTask) {
                  $("#taskRow")
                    .tmpl(savedTask)
                    .appendTo($(taskPage).find("#tblTasks tbody"))
                },
                errorLogger
              )
            }
          })
        initialised = true
      }
    },

    loadTasks: function() {
      storageEngine.findAll(
        "task",
        function(tasks) {
          $.each(tasks, function(index, task) {
            $("#taskRow")
              .tmpl(task)
              .appendTo($(taskPage).find("#tblTasks tbody"))
          })
        },
        errorLogger
      )
    },
  }
})()
