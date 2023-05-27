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
  }
  getMaxAppointmentAmount() {
    let totalMin = (this.date_to - this.date_from) / 60000;
    console.log("Minutos de atención total: ", totalMin);
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
}

class Appointment {
  constructor(id, person, date_from, date_to, professional, order) {
    this.id = id;
    this.person = person;
    this.date_from = date_from;
    this.date_to = date_to;
    this.professional = professional;
    this.order = order;
  }
}

function setPatientData(patient) {
  patient.doc_number = prompt(`Bienvenido
Para solicitar un turno ingrese su DNI:`);

  patient.sex = prompt("Ingrese su género (F, M, X):");

  patient.birthday =
    prompt(`Ingrese su fecha de nacimiento con el siguiente formato:
    dd/mm/aaaa`);

  patient.last_name = prompt("Ingrese su apellio:");

  patient.first_name = prompt("Ingrese su nombre:");
}

function selectProfessional(professional_list){
  professional_list.forEach(profesional => {
    console.log(profesional.id + ' - ' + profesional.person.last_name + ', ' + profesional.person.first_name);
  });
  return prompt(`Seleccione el profesional ingresando el número a la izquierda del nombre:`);
}

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

let professional_2 = new Professional(
  2,
  "A345",
  person_prof_2,
  "Cardiología"
);

let planning_1 = new ProfessionalPlanning(
  1,
  professional_1,
  new Date(2023, 5, 31, 8, 0, 0),
  new Date(2023, 5, 31, 12, 0, 0),
  30
);

let planning_2 = new ProfessionalPlanning(
  1,
  professional_1,
  new Date(2023, 6, 1, 15, 0, 0),
  new Date(2023, 6, 1, 19, 0, 0),
  60
);

let professional_list = [professional_1,professional_2];
let pattient_list = [];

let person_patient_1 = new Person();

// setPatientData(person_patient_1);
console.log('Profesional seleccionado: ', selectProfessional(professional_list)); 

console.log(person_patient_1);
// console.log(person_patient_1.getAge());

// console.log(person_prof_1);
// console.log(professional_1);
// console.log(planning_1);
// console.log(planning_1.getPlanningDates());
// console.log(planning_2.getPlanningDates());
