document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    var containerEl = document.getElementById('external-events');

    new FullCalendar.Draggable(containerEl, {
        itemSelector: '.fc-event',
        eventData: function (eventEl) {
            return {

                title: eventEl.innerText.trim(),
                start: new Date(),
                end: new Date()


            };
        }
    });

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
        },

        editable: true,
        droppable: true,

        drop: function (info) {
            info.draggedEl.parentNode.removeChild(info.draggedEl);
        }
    });
    calendar.render();
    loadExternalEvents();
    loadEvents(calendar);
});


function loadEvents(calendar) {
    $.ajax({
        url: './events.json',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            calendar.addEventSource(data);
        },
        error: function (xhr, status, error) {
            console.error('Error loading calendar events:', error);
        }
    });
}

function loadExternalEvents() {
    $.ajax({
        url: './list.json',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            const Events = $('#external-events');
            data.forEach(event => {
                const eventEl = $('<div></div>')
                    .addClass('fc-event')
                    .text(event.title);
                Events.append(eventEl);
            });
        },
        error: function (xhr, status, error) {
            console.error('Error loading external events:', error);
        }
    });
}