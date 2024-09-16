document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    var containerEl = document.getElementById('external-events');
    var modal = document.getElementById('eventModal'); // Add this line to get the modal element
    var modalClose = modal.querySelector('.modal-close'); // Add this line to get the close button

    // Initialize FullCalendar draggable events
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

    // Initialize FullCalendar
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
        },
        eventDrop: function (info) {
            // Automatically update the event when it's dragged and dropped
            var updatedEvent = {
                id: info.event.id,
                title: info.event.title,
                start: info.event.start,
                end: info.event.end ? info.event.end : null,
                description: info.event.extendedProps.description,
                type: info.event.extendedProps.type,
                status: info.event.extendedProps.status
            };

            // Call updateEvent to send data to the server
            updateEvent(updatedEvent);
        },
        eventResize: function (info) {
            // Automatically update the event when it's resized
            var updatedEvent = {
                id: info.event.id,
                title: info.event.title,
                start: info.event.start,
                end: info.event.end ? info.event.end : null,
                description: info.event.extendedProps.description,
                type: info.event.extendedProps.type,
                status: info.event.extendedProps.status
            };

            // Call updateEvent to send data to the server
            updateEvent(updatedEvent);
        },
        eventClick: function (info) {
            openEventPopup(info.event);
        }
    });

    calendar.render();
    loadExternalEvents();
    loadEvents(calendar);

    // Function to open the popup
    function openEventPopup(event) {
        var modalContent = modal.querySelector('.modal-body');
        modal.querySelector('.modal-title').textContent = event.title;
        modalContent.innerHTML = `
            <form id="updateForm">
                <div class="form-group">
                    <label for="eventTitle"><strong>Title:</strong></label>
                    <input type="text" id="eventTitle" name="title" class="form-control" value="${event.title}" required>
                </div>
                <div class="form-group">
                    <label for="eventStart"><strong>Start Date:</strong></label>
                    <input type="datetime" id="eventStart" name="start" class="form-control"  value="${event.start.toISOString().slice(0, 16)}" required>
                </div>
                <div class="form-group">
                    <label for="eventEnd"><strong>End Date:</strong></label>
                    <input type="datetime" id="eventEnd" name="end" class="form-control" value="${event.end ? event.end.toISOString().slice(0, 16) : ''}">
                </div>
                <div class="form-group">
                    <label for="eventDescription"><strong>Description:</strong></label>
                    <textarea id="eventDescription" name="description" class="form-control">${event.extendedProps.description || ''}</textarea>
                </div>
                <div class="form-group">
                        <label><strong>Type:</strong></label><br>
                        <input type="radio" id="eventTypePersonal" name="type" value="personal" ${event.extendedProps.type === 'personal' ? 'checked' : ''}>
                        <label for="eventTypePersonal">Personal</label>
                        <input type="radio" id="eventTypeProject" name="type" value="project" ${event.extendedProps.type === 'project' ? 'checked' : ''}>
                        <label for="eventTypeProject">Project</label>
                        <input type="radio" id="eventTypeOrganization" name="type" value="organization" ${event.extendedProps.type === 'organization' ? 'checked' : ''}>
                        <label for="eventTypeOrganization">Organization</label>
                </div>
                <div class="form-group">
                    <label for="eventStatus"><strong>Status:</strong></label><br>
                    <input type="radio" id="eventStatusActive" name="status" value="active" ${event.extendedProps.status === 'active' ? 'checked' : ''}>
                    <label for="eventStatusActive">Active</label>
                    <input type="radio" id="eventStatusInactive" name="status" value="inactive" ${event.extendedProps.status === 'inactive' ? 'checked' : ''}>
                    <label for="eventStatusInactive">Inactive</label>
                </div>
            <button type="submit" class="btn btn-primary">Save Changes</button>
            <button type="button" id="deleteEventBtn" class="btn btn-danger">Delete Event</button>
        </form>
    `;
        flatpickr("#eventStart", { dateFormat: "Y/m/d H:i", enableTime: true, minDate: "today" });
        flatpickr("#eventEnd", { dateFormat: "Y/m/d H:i", enableTime: true, minDate: "today" });

        $('#updateForm').on('submit', function (e) {
            e.preventDefault();
            var updatedEvent = {
                id: event.id,
                title: $('#eventTitle').val(),
                start: $('#eventStart').val(),
                end: $('#eventEnd').val(),
                description: $('#eventDescription').val(),
                type: $('input[name="type"]:checked').val(),
                status: $('input[name="status"]:checked').val()
            };
            if (confirm('Are you sure you want to Update this event?')) {
                updateEvent(updatedEvent);
            }

        });
        $('#deleteEventBtn').on('click', function () {
            if (confirm('Are you sure you want to delete this event?')) {
                deleteEvent(event.id);
            }
        });
        modal.style.display = 'block';
    }
    // Close the modal when the close button is clicked
    modalClose.onclick = function () {
        modal.style.display = 'none';
    };
    // Close the modal when clicking outside of the modal content
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
});

function updateEvent(updatedEvent) {
    $.ajax({
        url: 'update.php',  // Your API endpoint for updating events
        type: 'POST',
        data: JSON.stringify(updatedEvent),
        contentType: 'application/json',
        success: function (response) {
            try {
                const res = JSON.parse(response);
                if (res.success) {
                    alert('Event updated successfully!');
                    location.reload();
                } else {
                    alert('Error updating event: ' + res.error);
                }
            } catch (e) {
                alert('Error parsing response: ' + e.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error updating event: ' + textStatus + ' - ' + errorThrown);
        }
    });
}

function deleteEvent(eventId) {
    $.ajax({
        url: 'delete.php',  // Your API endpoint for deleting events
        type: 'POST',
        data: JSON.stringify({ id: eventId }),
        contentType: 'application/json',
        success: function (response) {
            try {
                const res = JSON.parse(response);
                if (res.success) {
                    alert('Event deleted successfully!');
                    location.reload();
                } else {
                    alert('Error deleting event: ' + res.error);
                }
            } catch (e) {
                alert('Error parsing response: ' + e.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Error deleting event: ' + textStatus + ' - ' + errorThrown);
        }
    });
}

function loadEvents(calendar) {
    $.ajax({
        url: './fetch.php',
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
        url: './list.php',
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

flatpickr("#startDateTime", {
    enableTime: true,
    minDate: "today",
    dateFormat: "y/m/d H:i", // Your preferred format (MM/DD/YYYY and 24-hour time)
});

// Initialize Flatpickr for end date and time
flatpickr("#endDateTime", {
    enableTime: true,
    minDate: "today",
    dateFormat: "y/m/d H:i",
});

$(document).ready(function () {
    $('#eventForm').on('submit', function (e) {
        e.preventDefault();
        var eventData = {
            title: $('#title').val(),
            start: $('#startDateTime').val(),
            end: $('#endDateTime').val(),
            description: $('#description').val(),
            type: $('input[name="type"]:checked').val(),
            status: $('input[name="status"]:checked').val()
        };
        $.ajax({
            url: 'insert.php',
            type: 'POST',
            data: JSON.stringify(eventData),
            contentType: 'application/json',
            success: function (response) {
                try {
                    var res = JSON.parse(response);
                    if (res.success) {
                        alert('Event added successfully!');
                        location.reload();
                    } else {
                        alert('Error adding event: ' + res.error);
                    }
                } catch (e) {
                    // alert('Error parsing response: ' + e.message);
                    console.error(e);
                    console.log(response);
                    console.log(data);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('Error: ' + textStatus + ' - ' + errorThrown);
            }
        });
    });
});

$(document).ready(function () {
    const $overlay = $('#overlay');

    $('[data-modal-target]').on('click', function () {
        const modalSelector = $(this).data('modal-target');
        const $modal = $(modalSelector);
        openModal($modal);
    });

    $overlay.on('click', function () {
        $('.modal.active').each(function () {
            closeModal($(this));
        });
    });

    $('[data-close-button]').on('click', function () {
        const $modal = $(this).closest('.modal');
        closeModal($modal);
    });

    function openModal($modal) {
        if ($modal.length === 0) return;
        $modal.addClass('active');
        $overlay.addClass('active');
    }

    function closeModal($modal) {
        if ($modal.length === 0) return;
        $modal.removeClass('active');
        $overlay.removeClass('active');
    }
});

