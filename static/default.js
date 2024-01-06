document.addEventListener('DOMContentLoaded', () => {
    const mainForm = document.querySelector('#mainForm')
    const nameField = document.querySelector("#name")
    const problemKnownOption = document.querySelector('#problem_known')
    const problemUnknownOption = document.querySelector('#problem_unknown')
    const selectProblem = document.querySelector('#problem');
    const otherProblemInput = document.querySelector('#otherProblemInput')
    const allProblemValues = document.querySelectorAll('output.problemValue');
    const symptoms = document.querySelector('#symptoms');
    const symtomsWordCount = document.querySelector('#symtomsWordCount')
    const selectDivision = document.querySelector('#division')
    const selectDistrict = document.querySelector('#district')
    const btnShowSubdistrictOrThanaInput = document.querySelector('#btnShowSubdistrictOrThanaInput')
    const selectSubdistrictOrThana = document.querySelector('#subdistrictOrThana')
    const selectHospital = document.querySelector('#hospital')
    const hospitalSelectionRow = document.querySelector('#hospitalSelectionRow')
    const allHospitalValues = document.querySelectorAll('output.hospitalNameValue')
    const selectDoctor = document.querySelector('#doctor')
    const allDoctorNameValues = document.querySelectorAll('output.doctorNameValue')
    const appointmentDateRow = document.querySelector('#appointmentDateRow')
    const btnConfirm = document.querySelector('#btnConfirm')

    // Automatically focused on first field while homepage is being loaded
    nameField.focus()

    // Enabling selectProblem and otherProblemInput
    problemKnownOption.addEventListener('click', () => {
        selectProblem.disabled = false
        otherProblemInput.disabled = false
    })

    // Disabling selectProblem and otherProblemInput
    problemUnknownOption.addEventListener('click', () => {
        selectProblem.disabled = true
        otherProblemInput.disabled = true
    })

    // Changing values of all output.problemValue + show/hide otherProblemInput
    selectProblem.addEventListener('input', event => {
        // Change values of all output.problemValue
        const selectedProblemValue = event.target.selectedOptions[0].innerText
        allProblemValues.forEach(each => {
            each.innerText = selectedProblemValue
        })

        // Show/hide otherProblemInput
        if (event.target.value === '_other') {
            otherProblemInput.style.display = 'block'
        } else {
            otherProblemInput.style.display = 'none'
        }
    })

    // Showing word count and limit for preventing input more than 255 characters
    symptoms.addEventListener('input', event => {
        const countWord = event.target.value.trim().length
        if (countWord <= 255) {
            symtomsWordCount.innerText = countWord
        } else {
            alert("রোগের লক্ষণসমূহ ২৫৫ অক্ষরের বেশি লিখা যাবে না।")
            symtomsWordCount.innerText = "255"
            event.target.value = event.target.value.slice(0, 255)
        }
    })

    // Loading divisions to #division
    fetch('/api/divisions')
        .then(res => res.json())
        .then(data => {
            data.forEach(each => selectDivision.innerHTML += `<option value=${each.id}>${each.value}</option>`);
        })
        .catch(err => console.error(err))

    // Loading districts on input #division
    selectDivision.addEventListener('input', event => {
        const divisionId = event.target.selectedOptions[0].getAttribute('value')

        fetch(`/api/districts?divisionId=${divisionId}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    selectDistrict.disabled = false
                    selectDistrict.innerHTML = '<option>-- সকল --</option>'
                    data.forEach(each => selectDistrict.innerHTML += `<option value=${each.id}>${each.value}</option>`);
                }
            })
            .catch(err => console.error(err))
    })

    // Loading hospitals \w showing hidden #hospitalSelectionRow + subdistrict/thanas on input #district
    selectDistrict.addEventListener('input', event => {
        const districtId = event.target.selectedOptions[0].getAttribute('value')

        // Loading hospitals with enabling select input
        fetch(`/api/hospitals?districtId=${districtId}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    hospitalSelectionRow.classList.remove('hide')
                    selectHospital.disabled = false
                    selectHospital.innerHTML = '<option>-- সকল --</option>'
                    data.forEach(each => selectHospital.innerHTML += `<option value=${each.id}>${each.value}</option>`)
                }
            }).then(() => {
                // Loading subdistrict/thanas with enabling select input
                fetch(`/api/subdistrictAndThanas?districtId=${districtId}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.length > 0) {
                            btnShowSubdistrictOrThanaInput.disabled = false
                            selectSubdistrictOrThana.disabled = false
                            selectSubdistrictOrThana.innerHTML = '<option>-- সকল --</option>'
                            data.forEach(each => selectSubdistrictOrThana.innerHTML += `<option value=${each.id}>${each.value}</option>`);

                        }
                    })
                    .catch(err => console.error(err))
            })
            .catch(err => console.error(err))
    })

    // Loading hospitals on input #subdistrictOrThana
    selectSubdistrictOrThana.addEventListener('input', event => {
        const subdistrictOrThanaId = event.target.selectedOptions[0].getAttribute('value')
        const subdistrictOrThanaName = event.target.selectedOptions[0].innerText

        fetch(`/api/hospitals?subdistrictOrThanaId=${subdistrictOrThanaId}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    selectHospital.disabled = false
                    selectHospital.innerHTML = '<option>-- নির্বাচন করুন --</option>'
                    data.forEach(each => selectHospital.innerHTML += `<option value=${each.id}>${each.value}</option>`);
                } else {
                    alert(`${subdistrictOrThanaName}-তে কোন হাসপাতাল পাওয়া যায় নি`)
                }
            })
            .catch(err => console.error(err))
    })

    // Loading doctors on input #hospital + changing values of all output.hospitalValues
    selectHospital.addEventListener('input', event => {
        const hospitalId = event.target.selectedOptions[0].getAttribute('value')

        fetch(`/api/doctors?hospitalId=${hospitalId}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    selectDoctor.disabled = false
                    selectDoctor.innerHTML = '<option>-- নির্বাচন করুন --</option>'
                    data.forEach(each => selectDoctor.innerHTML += `<option value=${each.id}>${each.name}, ${each.speciality}</option>`)
                }
            }).then(() => {
                // Change values of all output.hospitalValues
                const selectedHospitalValue = event.target.selectedOptions[0].innerText
                allHospitalValues.forEach(each => {
                    each.innerText = selectedHospitalValue
                })
            })
            .catch(err => console.error(err))
    })

    // Showing #selectSubdistrictOrThana and hide button itself
    btnShowSubdistrictOrThanaInput.addEventListener('click', event => {
        event.target.hidden = true;
        selectSubdistrictOrThana.hidden = false;
    })

    // Showing #appointmentDateRow + changing all output.allDoctorNameValues
    selectDoctor.addEventListener('input', event => {
        if (appointmentDateRow.classList.contains('hide')) {
            appointmentDateRow.classList.remove('hide')
        }

        const doctorName = event.target.selectedOptions[0].innerText.split(",")[0].trim(0)
        allDoctorNameValues.forEach(each => each.innerText = doctorName)
    })

    // If form#mainForm is submitted
    mainForm.addEventListener('submit', event => {
        event.preventDefault()

        const formData = new FormData(event.target)
        const formEntries = Object.fromEntries(formData.entries())

        console.log(formEntries);

        mainForm.reset()
    })
})