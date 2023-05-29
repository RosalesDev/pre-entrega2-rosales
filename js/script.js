/* -------------------------------------------------------------------------- */
/*                                   CLASES                                   */
/* -------------------------------------------------------------------------- */

class Person {
  constructor(
    id = Date.now(),
    doc_number,
    sex,
    last_name,
    first_name,
    birthday
  ) {
    this.id = id;
    this.doc_number = doc_number;
    this.sex = sex;
    this.last_name = last_name;
    this.first_name = first_name;
    this.birthday = birthday;
  }
  getAge() {
    let birthday_arr = this.birthday.split("/");

    let birthday_date = new Date(
      birthday_arr[2],
      birthday_arr[1] - 1,
      birthday_arr[0]
    );
    let ageDifMs = Date.now() - birthday_date.getTime();
    let ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
}

class Professional {
  constructor(id, license_code, person, specialty) {
    this.id = id;
    this.license_code = license_code;
    this.person = person;
    this.specialty = specialty;
  }
}

class ProfessionalPlanning {
  constructor(
    id,
    professional,
    date_from,
    date_to,
    max_appointmaint_duration_in_min
  ) {
    this.id = id;
    this.professional = professional;
    this.date_from = date_from;
    this.date_to = date_to;
    this.max_appointmaint_duration_in_min = max_appointmaint_duration_in_min;
    this.available_times_list = this.getPlanningDates();
  }
  getMaxAppointmentAmount() {
    let totalMin = (this.date_to - this.date_from) / 60000;
    return Math.floor(totalMin / this.max_appointmaint_duration_in_min);
  }
  getPlanningDates() {
    const maxAppointmentAmount = this.getMaxAppointmentAmount();
    let datesArr = [];
    let auxAppointmentDate = new Date(this.date_from);
    let currentMinutes = this.date_from.getMinutes();
    let minutesCounter = 0;

    datesArr.push(auxAppointmentDate.toLocaleTimeString());

    while (datesArr.length < maxAppointmentAmount) {
      minutesCounter = currentMinutes + this.max_appointmaint_duration_in_min;
      if (minutesCounter == 60) {
        auxAppointmentDate.setHours(auxAppointmentDate.getHours() + 1);
        currentMinutes = 0;
      } else {
        if (minutesCounter > 60) {
          auxAppointmentDate.setHours(
            auxAppointmentDate.getHours() + 1,
            minutesCounter - 60
          );
          currentMinutes = minutesCounter - 60;
        } else {
          currentMinutes += this.max_appointmaint_duration_in_min;
        }
      }
      auxAppointmentDate.setMinutes(currentMinutes);
      datesArr.push(auxAppointmentDate.toLocaleTimeString());
    }
    return datesArr;
  }

  deleteUsedTime(id) {
    this.available_times_list.splice(id, 1);
  }
}

class Appointment {
  constructor(person, time, professional_planning) {
    this.id = Date.now();
    this.person = person;
    this.time = time;
    this.professional_planning = professional_planning;
  }
  showAppointmentData() {
    console.log("=======DATOS DEL TURNO ASIGNADO=======");
    console.log(`DNI: ${this.person.doc_number}
    Apellido: ${this.person.last_name}
    Nombre: ${this.person.first_name}
    Fecha de nacimiento: ${this.person.birthday}
    Edad: ${this.person.getAge()}
    Hora del turno: ${this.time}`);
  }
}
/* -------------------------------------------------------------------------- */
/*                                 FIN CLASES                                 */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                  FUNCIONES                                 */
/* -------------------------------------------------------------------------- */

function setPatientData(patient) {
  patient.doc_number = prompt(
    "Bienvenido.\nPara solicitar un turno ingrese su DNI:"
  );

  patient.sex = prompt("Ingrese su género (F, M, X):");

  patient.birthday =
    prompt(`Ingrese su fecha de nacimiento con el siguiente formato:
    dd/mm/aaaa`);

  patient.last_name = prompt("Ingrese su apellio:");

  patient.first_name = prompt("Ingrese su nombre:");

  return patient;
}

function showProfessionalList(professional_list) {
  console.log("=======LISTA DE PROFESIONALES=======");
  professional_list.forEach((professional) => {
    console.log(
      professional.id +
        " - " +
        professional.person.last_name +
        ", " +
        professional.person.first_name
    );
  });
}

function showProfessionalPlanningTimes(available_times_list_list) {
  console.log("=======HORARIOS DISPONIBLES=======");
  for (let i = 0; i < available_times_list_list.length; i++) {
    console.log(`${i + 1} - ${available_times_list_list[i]}`);
  }
}

function findProfessional(professional, id) {
  return professional.id == id;
}

function planningByProfessional(planning, professional_id) {
  return planning.professional.id == professional_id;
}

function selectProfessional(professional_list) {
  let professional_id_list = [];
  let professional_template;
  let user_option;

  professional_list.forEach((professional) => {
    professional_id_list.push(professional.id);
  });

  professional_list.forEach((professional) => {
    if (professional_template == undefined) {
      professional_template = `
      ${professional.id} - ${professional.person.last_name}, ${professional.person.first_name} (${professional.specialty})`;
    } else {
      professional_template += `
      ${professional.id} - ${professional.person.last_name}, ${professional.person.first_name} (${professional.specialty})`;
    }
  });

  while (!professional_id_list.includes(user_option)) {
    user_option = parseInt(
      prompt(
        `Seleccione el profesional ingresando el número a la izquierda del nombre:
        ${professional_template}`
      )
    );
    if (!professional_id_list.includes(user_option)) {
      alert("La opción selecionada no es válida");
    }
  }

  return user_option;
}

function selectAppointmentTime(available_times_list) {
  if (available_times_list.length == 0) {
    alert("No hay mas horarios disponibles");
    return -1;
  }

  let user_option;

  user_option = parseInt(
    prompt(
      `Seleccione el horario ingresando el número a la izquierda del mismo:`
    )
  );

  user_option--;

  while (available_times_list[user_option] == undefined) {
    alert("La opción seleccionada no es válida.");
    user_option = parseInt(
      prompt(
        `Seleccione el horario ingresando el número a la izquierda del mismo:`
      )
    );
  }

  return user_option;
}

function createNewAppointment(person, time, professional_planning, time_id) {
  let appointment = new Appointment(person, time, professional_planning);
  professional_planning.deleteUsedTime(time_id);
  return appointment;
}
/* -------------------------------------------------------------------------- */
/*                                FIN FUNCIONES                               */
/* -------------------------------------------------------------------------- */

/* -------------------- SE CREAN OBJETOS PARA LAS PRUEBAS ------------------- */

let person_prof_1 = new Person(
  undefined,
  "35887554",
  "M",
  "Baldacci",
  "David",
  "21/12/1978"
);

let person_prof_2 = new Person(
  undefined,
  "36051238",
  "M",
  "Gray",
  "Dorian",
  "13/11/1980"
);

let professional_1 = new Professional(
  1,
  "A123",
  person_prof_1,
  "Medicina General"
);

let professional_2 = new Professional(2, "A345", person_prof_2, "Cardiología");

let planning_1 = new ProfessionalPlanning(
  1,
  professional_1,
  new Date(2023, 5, 31, 8, 0, 0),
  new Date(2023, 5, 31, 12, 0, 0),
  30
);

let planning_2 = new ProfessionalPlanning(
  2,
  professional_2,
  new Date(2023, 6, 1, 15, 0, 0),
  new Date(2023, 6, 1, 19, 0, 0),
  60
);

/* -------------------------------------------------------------------------- */
/*                        COMIENZA EJECUCIÓN PRINCIPAL                        */
/* -------------------------------------------------------------------------- */

/*UTILIZO VARIABLES GLOBALES PORQUE NO HE VISTO QUE SE USE UNA FUNCION MAIN O CLASE MAIN*/
let professional_list = [professional_1, professional_2];
let planning_list = [planning_1, planning_2];
let appointment_list = [];
let selected_professional_id;
let person_patient = new Person();

showProfessionalList(professional_list);

setPatientData(person_patient);

selected_professional_id = selectProfessional(professional_list);

let current_professional_planning = planning_list.find((planning) =>
  planningByProfessional(planning, selected_professional_id)
);

showProfessionalPlanningTimes(
  current_professional_planning.available_times_list
);

let time_selected_index = selectAppointmentTime(
  current_professional_planning.available_times_list
);

let time_selected =
  current_professional_planning.available_times_list[time_selected_index];

createNewAppointment(
  person_patient,
  time_selected,
  current_professional_planning,
  time_selected_index
).showAppointmentData();

// current_professional_planning.deleteUsedTime(time_selected);
// showProfessionalPlanningTimes(current_professional_planning.available_times_list);
