document.addEventListener('DOMContentLoaded', function () {
    let eventType = null;
    var eventTable = $('#eventTable').DataTable();
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
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
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
                start: info.event.start ? info.event.start.toISOString() : null,
                end: info.event.end ? info.event.end.toISOString() : null,
                description: info.event.extendedProps.description,
                type: info.event.extendedProps.type,
                badge: info.event.extendedProps.badge,
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
                start: info.event.start ? info.event.start.toISOString() : null,
                end: info.event.end ? info.event.end.toISOString() : null,
                description: info.event.extendedProps.description,
                type: info.event.extendedProps.type,
                badge: info.event.extendedProps.badge,
                status: info.event.extendedProps.status
            };
            // Call updateEvent to send data to the server
            updateEvent(updatedEvent);
        },
        eventDidMount: function (info) {
            // Trigger custom event to add event to DataTable
            $(document).trigger('eventAdded', [info.event]);

            // Apply filtering logic
            if (eventType && info.event.extendedProps.type !== eventType) {
                info.el.style.display = 'none';
            }
        },
        eventMouseEnter: function (info) {
            // Create and show a tooltip with the event title and description
            let tooltipContent = '<div class="hovertitle"><strong>' + info.event.title + '</strong></div>';
            if (info.event.extendedProps.description) {
                tooltipContent += '<div class="hoverdesc">' + info.event.extendedProps.description + '</div>';
            }

            let tooltip = $('<div class="fc-tooltip">' + tooltipContent + '</div>');
            $('body').append(tooltip);

            // Position the tooltip near the mouse cursor
            $(document).on('mousemove', function (e) {
                tooltip.css({
                    top: e.pageY + 10,  // Slightly below the cursor
                    left: e.pageX + 10  // Slightly to the right of the cursor
                });
            });
        },
        eventMouseLeave: function (info) {
            // Remove the tooltip when the mouse leaves the event
            $('.fc-tooltip').remove();
        },
        eventClick: function (info) {
            openEventPopup(info.event);
        },
        dateClick: function (info) {
            openDateModal(info.dateStr);
        },
        eventClassNames: function (info) {
            var extendedProps = info.event.extendedProps; // Access the extendedProps object
            var type = extendedProps.type; // Extract the type from extendedProps

            // Determine class names based on type
            if (type === 'personal') {
                return ['fc-event-personal'];
            } else if (type === 'project') {
                return ['fc-event-project'];
            } else if (type === 'organization') {
                return ['fc-event-organization'];
            }
            return []; // Default class if type is not matched
        }
    });

    calendar.render();
    loadExternalEvents();
    loadEvents(calendar);

    // function openCustomModal(eventTitle, eventDescription, eventElement) {
    //     var modal = document.getElementById('eventHoverModal');
    //     var modalLabel = document.getElementById('eventModalLabel');
    //     var modalDescription = document.getElementById('eventDescription');

    //     // Set the content of the modal
    //     modalLabel.textContent = eventTitle;
    //     modalDescription.textContent = eventDescription;

    //     // Get the event element's position
    //     var rect = eventElement.getBoundingClientRect();

    //     // Position the modal near the event
    //     modal.style.top = (rect.top + window.scrollY - modal.offsetHeight - 10) + 'px'; // 10px above the event
    //     modal.style.left = (rect.left + window.scrollX + (rect.width / 2) - (modal.offsetWidth / 2)) + 'px';

    //     // Show the modal
    //     modal.style.display = 'block';
    // }

    // // Function to close the modal
    // function closeCustomModal() {
    //     var modal = document.getElementById('eventHoverModal');
    //     modal.style.display = 'none';
    // }

    //Filter events by type
    $('#filter-events button').on('click', function () {
        let eventType = $(this).data('type'); // Get event type from the button
        if (!eventType) {
            console.error('Event type not found!');
            return;
        } else if (eventType === 'all') {
            // Load all events if the 'All' button is clicked
            loadEvents(calendar, null); // Passing `null` or an empty string can be a way to load all events
        } else {
            // Load events filtered by the selected event type
            loadEvents(calendar, eventType);
        } // Load events with the selected filter
    });

    let selectedFilterType = 'personal'; // Default to 'personal'

    // Function to handle button clicks to set the select value
    $('#filter-events .btn').on('click', function () {
        const type = $(this).data('type'); // Get the type from the button

        if (type === 'all') {
            selectedFilterType = 'personal'; // Set to 'personal' when "All" is clicked
        } else {
            selectedFilterType = type;
        }
        $('#eventtype').val(selectedFilterType); // Set the dropdown value
        updateBadgeVisibility(); // Update badge visibility
    });

    function openDateModal(dateStr) {
        var modalContent = modal.querySelector('.modal-body');
        modal.querySelector('.modal-title').textContent = 'Add New Event';

        // Set default values for the date fields
        modalContent.innerHTML = `
            <form id="eventForm">
                <div class="form-group">
                    <label for="eventTitle"><strong>Title:</strong></label>
                    <input type="text" id="eventTitle" name="title" class="form-control" placeholder="Event Name" required>
                </div>
                <div class="form-group">
                    <label for="eventStart"><strong>Start Date:</strong></label>
                    <input type="datetime" id="eventStart" name="start" class="form-control" value="${dateStr}" required>
                </div>
                <div class="form-group">
                    <label for="eventEnd"><strong>End Date:</strong></label>
                    <input type="datetime" id="eventEnd" name="end" class="form-control" value="${dateStr}">
                </div>
                <div class="form-group">
                    <label for="eventDescription"><strong>Description:</strong></label>
                    <textarea id="eventDescription" name="description" class="form-control" placeholder="Description"></textarea>
                </div>
                <div class="form-group">
                    <label for="eventtype">Type</label>
                    <select id="eventtype" name="type" required>
                        <option value="personal" selected>Personal</option>
                        <option value="project">Project</option>
                        <option value="organization">Organization</option>
                    </select>
                </div>
                <div class="badge-selection" id="badge-selection">
                    <label>Badge</label><br>

                    <!-- Personal-related badges -->
                    <div id="badgepersonal" class="badge-group">
                        <input type="radio" id="badge-personal-work" name="personal_badge" value="1">
                        <label for="badge-personal-work">Work</label><br>

                        <input type="radio" id="badge-personal-travel" name="personal_badge" value="2">
                        <label for="badge-personal-travel">Travel</label><br>

                        <input type="radio" id="badge-personal-appointment" name="personal_badge" value="3">
                        <label for="badge-personal-appointment">Appointment</label><br>
                    </div>

                    <!-- Project-related badges -->
                    <div id="badgeproject" class="badge-group">
                        <input type="radio" id="badge-project-work" name="project_badge" value="1">
                        <label for="badge-project-work">Work</label><br>

                        <input type="radio" id="badge-project-travel" name="project_badge" value="2">
                        <label for="badge-project-travel">Travel</label><br>

                        <input type="radio" id="badge-project-appointment" name="project_badge" value="3">
                        <label for="badge-project-appointment">Appointment</label><br>

                        <input type="radio" id="badge-project-limited" name="project_badge" value="4">
                        <label for="badge-project-limited">Limited</label><br>
                    </div>

                    <!-- Organization-related badges -->
                    <div id="badgeorganization" class="badge-group">
                        <input type="radio" id="badge-organization-work" name="organization_badge" value="1">
                        <label for="badge-organization-work">Work</label><br>

                        <input type="radio" id="badge-organization-travel" name="organization_badge" value="2">
                        <label for="badge-organization-travel">Travel</label><br>

                        <input type="radio" id="badge-organization-appointment" name="organization_badge" value="3">
                        <label for="badge-organization-appointment">Appointment</label><br>

                        <input type="radio" id="badge-organization-meeting" name="organization_badge" value="4" >
                        <label for="badge-organization-meeting">Meeting</label><br>
                    </div>
                </div>
                <div class="form-group">
                    <label><strong>Status:</strong></label><br>
                    <input type="radio" id="eventStatusActive" name="status" value="active" required checked>
                    <label for="eventStatusActive">Active</label>
                    <input type="radio" id="eventStatusInactive" name="status" value="inactive" required>
                    <label for="eventStatusInactive">Inactive</label>
                </div>
                <button type="submit" id="insert" class="btn btn-primary">Add Event</button>
            </form>
        `;

        // Initialize Flatpickr for start date and time
        flatpickr("#eventStart", {
            enableTime: true,
            enableSeconds: true,          // Enable seconds picker
            minDate: "today",
            dateFormat: "Y/m/d H:i:S",    // Correct format for including seconds (Y for 4-digit year, H for 24-hour time)
            time_24hr: true
        });

        // Initialize Flatpickr for end date and time
        flatpickr("#eventEnd", {
            enableTime: true,
            enableSeconds: true,          // Enable seconds picker
            minDate: "today",
            dateFormat: "Y/m/d H:i:S",    // Correct format for including seconds (Y for 4-digit year, H for 24-hour time)
            time_24hr: true
        });

        // Call the function immediately to display the correct badges on page load or modal open
        updateBadgeVisibility();

        // Optionally, if you still want to handle changes in the dropdown
        $('#eventtype').change(function () {
            updateBadgeVisibility();
        });

        $('#eventtype').val(selectedFilterType);
        updateBadgeVisibility();

        function getBadge() {
            var badgeType = $('#eventtype').val(); // Get the selected type
            if (badgeType === 'personal') {
                var badge = $('input[name="personal_badge"]:checked').val();
            } else if (badgeType === 'project') {
                badge = $('input[name="project_badge"]:checked').val();
            } else if (badgeType === 'organization') {
                badge = $('input[name="organization_badge"]:checked').val();
            }
            return badge; // If no badge is selected
        }

        // Show the modal and overlay
        modal.style.display = 'block';
        overlay.style.display = 'block';

        // Handle form submission
        var eventForm = modal.querySelector('#eventForm');
        eventForm.addEventListener('submit', function (event) {
            event.preventDefault();

            var formData = new FormData(eventForm);
            var eventData = {
                title: formData.get('title'),
                start: formData.get('start'),
                end: formData.get('end'),
                description: formData.get('description'),
                type: formData.get('type'),
                badge: getBadge(),
                status: formData.get('status')
            };
            // Send the form data to the server
            $.ajax({
                url: 'insert.php',
                type: 'POST',
                data: JSON.stringify(eventData),
                contentType: 'application/json',
                success: function (response) {
                    try {
                        if (response.success) {
                            alert('Event added successfully!');
                            location.reload();
                        } else {
                            alert('Error adding event: ' + response.error);
                        }
                    } catch (e) {
                        // alert('Error parsing response: ' + e.message);
                        console.error(e);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error: ' + textStatus + ' - ' + errorThrown);
                }
            });
        });
    }

    // Function to update badge visibility based on selected type
    function updateBadgeVisibility() {
        var selectedType = $('#eventtype').val();
        // Hide all badge groups initially
        $('.badge-group').attr("style", "display: none !important");

        // Show relevant badge group based on selected event type
        if (selectedType === 'personal') {
            $('#badgepersonal').attr("style", "display: flex !important"); // Show Personal-related badges
        } else if (selectedType === 'project') {
            $('#badgeproject').attr("style", "display: flex !important"); // Show Project-related badges
        } else if (selectedType === 'organization') {
            $('#badgeorganization').attr("style",
                "display: flex !important"); // Show Organization-related badges
        }
    }

    // // Format date to 'YYYY-MM-DDTHH:MM' (local time) for datetime-local input
    // function formatDateForBackend(date) {
    //     const year = date.getFullYear();
    //     const month = ('0' + (date.getMonth() + 1)).slice(-2); // Ensure 2 digits
    //     const day = ('0' + date.getDate()).slice(-2);
    //     const hours = ('0' + date.getHours()).slice(-2);
    //     const minutes = ('0' + date.getMinutes()).slice(-2);
    //     const seconds = ('0' + date.getSeconds()).slice(-2);

    //     return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    // }

    function openEventPopup(event) {
        var modalContent = modal.querySelector('.modal-body');
        modal.querySelector('.modal-title').textContent = "Update Event";

        // Format the event start and end dates in Y/m/d H:i:S
        var formattedStart = flatpickr.formatDate(new Date(event.start), "Y/m/d H:i:S");
        var formattedEnd = event.end ? flatpickr.formatDate(new Date(event.end), "Y/m/d H:i:S") : '';

        // Use the Y/M/D H:M:S format for text inputs
        modalContent.innerHTML = `
            <form id="updateForm">
                <div class="form-group">
                    <label for="eventTitle"><strong>Title:</strong></label>
                    <input type="text" id="eventTitle" name="title" class="form-control" value="${event.title}" required>
                </div>
                <div class="form-group">
                    <label for="eventStart"><strong>Start Date:</strong></label>
                    <input type="datetime" id="eventStart" name="start" class="form-control" value="${formattedStart}" required>
                </div>
                <div class="form-group">
                    <label for="eventEnd"><strong>End Date:</strong></label>
                    <input type="datetime" id="eventEnd" name="end" class="form-control" value="${formattedEnd ? formattedEnd : ''}">
                </div>
                <div class="form-group">
                    <label for="eventDescription"><strong>Description:</strong></label>
                    <textarea id="eventDescription" name="description" class="form-control">${event.extendedProps.description || ''}</textarea>
                </div>
              
                <div class="form-group">
                    <label for="eventtype"><strong>Type:</strong></label><br>
                    <select id="eventtype" name="type" required>
                        <option value="personal" ${event.extendedProps.type === 'personal' ? 'selected' : ''}>Personal</option>
                        <option value="project" ${event.extendedProps.type === 'project' ? 'selected' : ''}>Project</option>
                        <option value="organization" ${event.extendedProps.type === 'organization' ? 'selected' : ''}>Organization</option>
                    </select>
                </div>
                <div class="badge-selection" id="badge-selection">
                    <label for="eventbadge"><strong>Badge</strong></label><br>
                        <!-- Personal-related badges -->
                        <div id="badgepersonal" class="badge-group">
                            <input type="radio" id="badge-personal-work" name="personal_badge" value="1" ${event.extendedProps.badge === '1' ? 'checked' : ''}>
                            <label for="badge-personal-work">Work</label><br>
                            <input type="radio" id="badge-personal-travel" name="personal_badge" value="2" ${event.extendedProps.badge === '2' ? 'checked' : ''}>
                            <label for="badge-personal-travel">Travel</label><br>
                            <input type="radio" id="badge-personal-appointment" name="personal_badge" value="3" ${event.extendedProps.badge === '3' ? 'checked' : ''}>
                            <label for="badge-personal-appointment">Appointment</label><br>
                        </div>

                        <!-- Project-related badges -->
                        <div id="badgeproject" class="badge-group">
                            <input type="radio" id="badge-project-work" name="project_badge" value="1 ${event.extendedProps.badge === '1' ? 'checked' : ''}>
                            <label for="badge-project-work">Work</label><br>

                            <input type="radio" id="badge-project-travel" name="project_badge" value="2" ${event.extendedProps.badge === '2' ? 'checked' : ''}>
                            <label for="badge-project-travel">Travel</label><br>

                            <input type="radio" id="badge-project-appointment" name="project_badge" value="3" ${event.extendedProps.badge === '3' ? 'checked' : ''}>
                            <label for="badge-project-appointment">Appointment</label><br>

                        <input type="radio" id="badge-project-limited" name="project_badge" value="4" ${event.extendedProps.badge === '4' ? 'checked' : ''}>
                        <label for="badge-project-limited">Limited</label><br>
                    </div>

                    <!-- Organization-related badges -->
                    <div id="badgeorganization" class="badge-group">
                        <input type="radio" id="badge-organization-work" name="organization_badge" value="1" ${event.extendedProps.badge === '1' ? 'checked' : ''}>
                        <label for="badge-organization-work">Work</label><br>

                        <input type="radio" id="badge-organization-travel" name="organization_badge" value="2"${event.extendedProps.badge === '2' ? 'checked' : ''}>
                        <label for="badge-organization-travel">Travel</label><br>

                        <input type="radio" id="badge-organization-appointment" name="organization_badge" value="3" ${event.extendedProps.badge === '3' ? 'checked' : ''}>
                        <label for="badge-organization-appointment">Appointment</label><br>

                        <input type="radio" id="badge-organization-meeting" name="organization_badge" value="4" ${event.extendedProps.badge === '4' ? 'checked' : ''}>
                        <label for="badge-organization-meeting">Meeting</label><br>
                    </div>
                </div>

                <div class="form-group">
                    <label for="eventStatus"><strong>Status:</strong></label><br>
                    <input type="radio" id="eventStatusActive" name="status" value="active" ${event.extendedProps.status === 'active' ? 'checked' : ''}>
                    <label for="eventStatusActive">Active</label>
                    <input type="radio" id="eventStatusInactive" name="status" value="inactive" ${event.extendedProps.status === 'inactive' ? 'checked' : ''}>
                    <label for="eventStatusInactive">Inactive</label>
                </div>
            <button type="submit" class="btn btn-primary">Update Changes</button>
            <button type="button" id="deleteEventBtn" class="btn btn-danger">Delete Event</button>
            <button type="button" id="discardBtn" class="btn btn-danger">Discard</button>
        </form>
        `;

        // Call the function immediately to display the correct badges on page load or modal open
        updateBadgeVisibility();

        // Optionally, if you still want to handle changes in the dropdown
        $('#eventtype').change(function () {
            updateBadgeVisibility();
        });

        //Initialize flatpickr for start date
        flatpickr("#eventStart", {
            enableTime: true,
            enableSeconds: true,          // Enable seconds picker
            minDate: "today",
            dateFormat: "Y/m/d H:i:S",    // Correct format for including seconds (Y for 4-digit year, H for 24-hour time)
            time_24hr: true
        });

        //Initialize flatpickr for start date
        flatpickr("#eventEnd", {
            enableTime: true,
            enableSeconds: true,          // Enable seconds picker
            minDate: "today",
            dateFormat: "Y/m/d H:i:S",    // Correct format for including seconds (Y for 4-digit year, H for 24-hour time)
            time_24hr: true
        });

        $('#updateForm').on('submit', function (e) {
            e.preventDefault();
            var type = $('#eventtype').val();
            // Collect data and ensure it's in the 'Y/M/D H:M:S' format
            var updatedEvent = {
                id: event.id,
                title: document.getElementById('eventTitle').value,
                start: document.getElementById('eventStart').value,  // In 'Y/M/D H:M:S' format
                end: document.getElementById('eventEnd').value || null,
                description: document.getElementById('eventDescription').value,
                type: $('#eventtype').val(),
                badge: getBadge(),
                status: document.querySelector('input[name="status"]:checked').value
            };

            if (confirm('Are you sure you want to Update this event?')) {
                updateEvent(updatedEvent); // Send the updated data to the backend
            }
        });
        $('#deleteEventBtn').on('click', function () {
            if (confirm('Are you sure you want to delete this event?')) {
                deleteEvent(event.id);
            }
        });
        $('#discardBtn').on('click', function () {
            modal.style.display = 'none';
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

    function getBadge() {
        var badgeType = $('#eventtype').val(); // Get the selected type
        if (badgeType === 'personal') {
            var badge = $('input[name="personal_badge"]:checked').val();
        } else if (badgeType === 'project') {
            badge = $('input[name="project_badge"]:checked').val();
        } else if (badgeType === 'organization') {
            badge = $('input[name="organization_badge"]:checked').val();
        }
        return badge; // If no badge is selected
    }
});

function updateBadgeVisibility() {
    var selectedType = $('#eventtype').val();
    // Hide all badge groups initially
    $('.badge-group').attr("style", "display: none !important");
    // Show relevant badge group based on selected event type
    if (selectedType === 'personal') {
        $('#badgepersonal').attr("style", "display: flex !important"); // Show Personal-related badges
    } else if (selectedType === 'project') {
        $('#badgeproject').attr("style", "display: flex !important"); // Show Project-related badges
    } else if (selectedType === 'organization') {
        $('#badgeorganization').attr("style",
            "display: flex !important"); // Show Organization-related badges
    }
}

// Update the event on the server
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

// Delete the event on the server
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

// Get all buttons inside the filter-events
const buttons = document.querySelectorAll('#filter-events .btn');
const events = document.querySelectorAll('#events-list .event');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const eventType = button.getAttribute('data-type');
        const url = new URL(window.location.href);
        if (eventType === 'all') {
            url.searchParams.delete('eventType'); // Remove the eventType parameter
            window.history.pushState({}, '', url); // Update the URL without reloading the page
            location.reload(); // Refresh the page
        } else {
            const quotedEventType = `"${eventType}"`; // Add quotes around the value
            url.searchParams.set('eventType', quotedEventType); // Update the eventType parameter
            window.history.pushState({}, '', url); // Update the URL without reloading the page
        }
        // Display events based on the selected type
        filterEvents(eventType);
    });
});

function filterEvents(eventType) {
    events.forEach(event => {
        if (eventType === 'all' || event.getAttribute('data-type') === eventType) {
            event.style.display = ''; // Show the event
        } else {
            event.style.display = 'none'; // Hide the event
        }
    });
}
// Load events from the server
function loadEvents(calendar, eventType = null) {
    $.ajax({
        url: './fetch.php',
        method: 'GET',
        data: { eventType: eventType },
        dataType: 'json',
        success: function (data) {
            const params = new URLSearchParams(window.location.search);
            const urleventType = params.get('eventType') ? JSON.parse(params.get('eventType')) : null;
            // Determine the effective event type to filter by
            const effectiveEventType = eventType || urleventType;

            let filteredEvents = data.filter(function (event) {
                return !effectiveEventType || event.extendedProps.type === effectiveEventType;
            });

            calendar.removeAllEventSources();
            calendar.addEventSource(filteredEvents);
        },
        error: function (xhr, status, error) {
            console.error('Error loading calendar events:', error);
        }
    });
}

// Load external events from the server
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

// Initialize Flatpickr for start date and time
flatpickr("#startDateTime", {
    enableTime: true,
    enableSeconds: true,          // Enable seconds picker
    minDate: "today",
    dateFormat: "Y/m/d H:i:S",    // Correct format for including seconds (Y for 4-digit year, H for 24-hour time)
    time_24hr: true               // Enable 24-hour time format
});

// Initialize Flatpickr for end date and time
flatpickr("#endDateTime", {
    enableTime: true,
    enableSeconds: true,          // Enable seconds picker
    minDate: "today",
    dateFormat: "Y/m/d H:i:S",    // Correct format for including seconds (Y for 4-digit year, H for 24-hour time)
    time_24hr: true               // Enable 24-hour time format
});

// Handle dropdown change event
$(document).ready(function () {
    $('#eventtype').on('change', function () {
        var selectedType = $(this).val();
        // Hide all badge groups initially
        $('.badge-group').attr("style", "display: none !important");
        // Show relevant badge group based on selected event type
        if (selectedType === 'personal') {
            $('#badge-personal').attr("style",
                "display: flex !important"); // Show Personal-related badges
        } else if (selectedType === 'project') {
            $('#badge-project').attr("style",
                "display: flex !important"); // Show Project-related badges
        } else if (selectedType === 'organization') {
            $('#badge-organization').attr("style",
                "display: flex !important"); // Show Organization-related badges
        }
    });
});

// Handle form submission
$(document).ready(function () {
    $('#eventForm').on('submit', function (e) {
        e.preventDefault();
        var eventType = $('#event-type').val();
        var eventData = {
            title: $('#title').val(),
            start: $('#startDateTime').val(),
            end: $('#endDateTime').val(),
            description: $('#description').val(),
            type: eventType,
            badge: getSelectedBadge(),
            status: $('input[name="status"]:checked').val()
        };
        $.ajax({
            url: 'insert.php',
            type: 'POST',
            data: JSON.stringify(eventData),
            contentType: 'application/json',

            success: function (response) {
                try {
                    if (response.success) {
                        alert('Event added successfully!');
                        location.reload();
                    } else {
                        alert('Error adding event: ' + res.error);
                    }
                } catch (e) {
                    console.error('Error parsing JSON:', e);
                    console.log('Server response:', response);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('Error: ' + textStatus + ' - ' + errorThrown);
            }
        });
    });
});

// Function to get the selected badge
function getSelectedBadge() {
    var badgeType = $('#event-type').val(); // Get the selected type
    if (badgeType === 'personal') {
        var badge = $('input[name="personal_badge"]:checked').val();
    } else if (badgeType === 'project') {
        badge = $('input[name="project_badge"]:checked').val();
    } else if (badgeType === 'organization') {
        badge = $('input[name="organization_badge"]:checked').val();
    }
    return badge; // If no badge is selected
}

// Add popup modal when ADD EVENT button is clicked
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


