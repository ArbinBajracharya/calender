<html lang='en'>

<head>
    <meta charset='utf-8' />
    <link href="style.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.min.css" />
    <!-- <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous"> -->
</head>

<body>
    <div class="new-events">
        <div class="events-handle">
            <div id="filter-events" class="left-align">
                <button class="btn" data-type="all">All</button>
                <button class="btn fc-event-personal" data-type="personal">Personal</button>
                <button class="btn fc-event-project" data-type="project">Project</button>
                <button class="btn fc-event-organization" data-type="organization">Organization</button>
            </div>
            <div class="view-events">
                <button class="btn" id="view-events"><a href="table.php" style="text-decoration:none;color:black">View
                        Events</a></button>
            </div>
            <div id="add-events" class="right-align">
                <button data-modal-target="#modal" class="btn">Add Event</button>
            </div>
        </div>
        <div class="modal" id="modal">
            <div class="modal-header">
                <div class="title">Add Event</div>
                <button data-close-button class="close-button">&times;</button>
            </div>
            <div class="modal-body">
                <form class="form" id="eventForm" method="post">
                    <div class="event-form">
                        <label>Name:</label>
                        <input type="text" id="title" name="title" placeholder="Event Name" required>
                    </div>
                    <div class="event-form">
                        <label>Start Date:</label>
                        <input type="datetime" id="startDateTime" name="start" placeholder="Start Date" required>
                    </div>
                    <div class="event-form">
                        <label>End Date:</label>
                        <input type="datetime" id="endDateTime" name="end" placeholder="End Date">
                    </div>
                    <div class="event-form">
                        <label>Description</label>
                        <textarea name="description" id="description" placeholder="Description"></textarea>
                    </div>
                    <div class="event-form">
                        <label for="event-type">Type</label><br>
                        <select id="event-type" name="type" required">
                            <option value="personal">Personal</option>
                            <option value="project">Project</option>
                            <option value="organization">Organization</option>
                        </select>
                    </div><br>
                    <div class="badge-selection" id="badge-selection">
                        <label>Badge</label><br>

                        <!-- Personal-related badges -->
                        <div id="badge-personal" class="badge-group">
                            <input type="radio" id="badge-personal-work" name="personal_badge" value="1">
                            <label for="badge-personal-work">Work</label><br>

                            <input type="radio" id="badge-personal-travel" name="personal_badge" value="2">
                            <label for="badge-personal-travel">Travel</label><br>

                            <input type="radio" id="badge-personal-appointment" name="personal_badge" value="3">
                            <label for="badge-personal-appointment">Appointment</label><br>
                        </div>

                        <!-- Project-related badges -->
                        <div id="badge-project" class="badge-group">
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
                        <div id="badge-organization" class="badge-group">
                            <input type="radio" id="badge-organization-work" name="organization_badge" value="1">
                            <label for="badge-organization-work">Work</label><br>

                            <input type="radio" id="badge-organization-travel" name="organization_badge" value="2">
                            <label for="badge-organization-travel">Travel</label><br>

                            <input type="radio" id="badge-organization-appointment" name="organization_badge" value="3">
                            <label for="badge-organization-appointment">Appointment</label><br>

                            <input type="radio" id="badge-organization-meeting" name="organization_badge" value="4">
                            <label for="badge-organization-meeting">Meeting</label><br>
                        </div>
                    </div><br>
                    <div class="event-form">
                        <label>Status</label><br>
                        <input type="radio" name="status" value="active" required checked>Active
                        <input type="radio" name="status" value="inactive" required>Inactive
                    </div>
                    <button type="submit" id="insert" name="submit">Add Event</button>
                </form>
            </div>
        </div>
        <div id="overlay"></div>
    </div>
    <!-- <div class="text-end">
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Add Events
        </button>
    </div>

    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form class="form" id="eventForm" method="post">
                        <div class="mb-3">
                            <label for="title" class="form-label">Name:</label>
                            <input type="text" id="title" name="title" class="form-control" placeholder="Event Name"
                                required>
                        </div>
                        <div class="mb-3">
                            <label for="startDateTime" class="form-label">Start Date:</label>
                            <input type="datetime" id="startDateTime" name="start" class="form-control"
                                placeholder="YYYY/MM/DD" required>
                        </div>
                        <div class="mb-3">
                            <label for="endDateTime" class="form-label">End Date:</label>
                            <input type="datetime" id="endDateTime" name="end" class="form-control"
                                placeholder="YYYY/MM/DD">
                        </div>
                        <div class="mb-3">
                            <label for="description" class="form-label">Description:</label>
                            <textarea name="description" id="description" class="form-control"
                                placeholder="Description"></textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Type:</label><br>
                            <div class="form-check form-check-inline">
                                <input type="radio" id="typePersonal" name="type" value="personal"
                                    class="form-check-input" required>
                                <label for="typePersonal" class="form-check-label">Personal</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input type="radio" id="typeProject" name="type" value="project"
                                    class="form-check-input" required>
                                <label for="typeProject" class="form-check-label">Project</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input type="radio" id="typeOrganizational" name="type" value="organizational"
                                    class="form-check-input" required>
                                <label for="typeOrganizational" class="form-check-label">Organizational</label>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Status:</label><br>
                            <div class="form-check form-check-inline">
                                <input type="radio" id="statusActive" name="status" value="active"
                                    class="form-check-input" required>
                                <label for="statusActive" class="form-check-label">Active</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input type="radio" id="statusInactive" name="status" value="inactive"
                                    class="form-check-input" required>
                                <label for="statusInactive" class="form-check-label">Inactive</label>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="submit" id="insert" class="btn btn-primary" name="submit">Add Event</button>
                </div>
            </div>
        </div>
    </div> -->

    <div id='external-events'>
        <p>
            <strong>Draggable Events</strong>
        </p>
    </div>
    <div id="calendar-container">
        <div id='calendar'></div>
    </div>



    <div id="eventModal" class="eventmodal">
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <h2 class="modal-title"></h2>
            <div class="modal-body">
            </div>
            <div class="modal-footer">
            </div>
        </div>
    </div>

    <!-- <div id="eventHoverModal" class="custom-popup-modal">
        <div class="custom-popup-content">
            <div class="custom-popup-header">
                <h5 id="eventModalLabel">Event Name</h5>
            </div>
            <div class="custom-popup-body">
                <p id="eventDescription">Event Description</p>
            </div>
        </div>
    </div> -->

    <script src="https://code.jquery.com/jquery-3.6.0.min.js">
    </script>
    <script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js'></script>
    <script type="text/javascript" src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <!-- <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous">
    </script> -->
    <script src="script.js">
    </script>
    <script>
    // Function to update badge visibility based on selected type and Filter type
    $(document).ready(function() {
        // Function to update badge visibility based on selected type
        function updateBadgeVisibility() {
            var selectedType = $('#event-type').val();

            // Hide all badge groups initially
            $('.badge-group').attr("style", "display: none !important");

            // Show relevant badge group based on selected event type
            if (selectedType === 'personal') {
                $('#badge-personal').attr("style", "display: flex !important"); // Show Personal-related badges
            } else if (selectedType === 'project') {
                $('#badge-project').attr("style", "display: flex !important"); // Show Project-related badges
            } else if (selectedType === 'organization') {
                $('#badge-organization').attr("style",
                    "display: flex !important"); // Show Organization-related badges
            }
        }

        // Call the function immediately to display the correct badges on page load or modal open
        updateBadgeVisibility();

        //To handle changes in the dropdown
        $('#event-type').change(function() {
            updateBadgeVisibility();
        });

        //handle button clicks to set the select value
        $('#filter-events .btn').on('click', function() {
            const type = $(this).data('type');
            if (type === 'all') {
                selectedFilterType = 'personal'; // Set to 'personal' when "All" is clicked
            } else {
                selectedFilterType = type;
            }
            $('#event-type').val(selectedFilterType); // Set the dropdown value
            updateBadgeVisibility();
        });
    });
    </script>
</body>

</html>