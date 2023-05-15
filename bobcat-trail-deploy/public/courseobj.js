import { get, set, entries, del } from '/node_modules/idb-keyval/dist/compat.js';


const course_obj = {
    course_name: String,
    course_location: String,
    course_start_time: String,
    course_end_time: String,
    course_color: String
};

export function createNewCourse() {
    var typed_course_name = document.getElementById("course-name").value;
    typed_course_name = typed_course_name.replace('-', ' ');
    var course_name = typed_course_name.replace(/[^a-zA-Z0-9 ]/g, '');
    var safe_name = typed_course_name.replace(/[^a-zA-Z0-9]/g, '');
    var course_location = document.getElementById("course-location").value;
    let course_days = Array.from(document.getElementById("course-days").selectedOptions).map(({ value }) => value);
    var course_start_time = document.getElementById("course-start-time").value;
    var course_end_time = document.getElementById("course-end-time").value;
    var course_color = document.getElementById("course-color").value;
    var course = {
        course_name: course_name,
        safe_name: safe_name,
        course_location: course_location,
        course_days: course_days,
        course_start_time: course_start_time,
        course_end_time: course_end_time,
        course_color: course_color
    };
    // initial keyval testing
    if (course_name != "" && course_location in buildings) {
        set(course.safe_name, course)
            .then(() => {
                console.log('Course was added!');
                window.location.reload();
            })
            .catch((err) => console.log('It failed!', err));
    } else {
        // set failed, display error message
        var labelLocation = document.getElementById("location-error-msg");
        labelLocation.innerHTML = "Course location: <br><br><strong>ERROR:</strong> Invalid location, select from dropdown...";
    }
}
window.createNewCourse = createNewCourse;

export function deleteCourseObject(course_name) {
    console.log(course_name);
    del(course_name)
        .then(() => {
            console.log('Course deleted!');
            window.location.reload();
        })
        .catch((err) => console.log('Course failed to delete!', err));

}
window.deleteCourseObject = deleteCourseObject;

export function getEventDivs() {
    var classContainer = document.getElementById("class-container")
    entries().then((response) => {
        for (let i = 0; i < response.length; i++) {
            course_object = document.createElement('script');
            course_object.innerHTML = `
                var `+ response[i][1]["safe_name"] + `_object = {
                    latlng: {lat: buildings["`+ response[i][1]["course_location"] + `"][0], lng: buildings["` + response[i][1]["course_location"] + `"][1]}
                }
            `;
            classContainer.appendChild(course_object);
            var classDiv = document.createElement('div');
            classDiv.setAttribute('class', 'course-circle');
            classDiv.setAttribute('id', response[i][1]["safe_name"]);
            classDiv.setAttribute('onclick', "addRoute(" + response[i][1]["safe_name"] + "_object, map)");
            classDiv.innerHTML = `
                <div class="top-banner-color" style="background-color: `
                + response[i][1]["course_color"] +
                `"><p class="remove-course-button" onclick="deleteCourseObject('`
                + response[i][1]["safe_name"] + `')">×</p></div>` +
                `<p class="course-title">
                `+ response[i][1]["course_name"] + ` 
                </p>
                <p class="course-location">
                    `+ response[i][1]["course_location"] + `
                </p>
            `;
            classContainer.appendChild(classDiv);
        }
    })
}
window.getEventDivs = getEventDivs;