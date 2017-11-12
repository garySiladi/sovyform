export const PEOPLE_LIST = 'people_list';

export function getPeople() {
  if (typeof (localStorage) !== 'undefined') {
    const peopleList = localStorage.getItem(PEOPLE_LIST);
    return JSON.parse(peopleList || 'null') || [];
  }
  return [];
}

export function getLastID() {
  if (typeof (localStorage) !== 'undefined') {
    const peopleList = localStorage.getItem(PEOPLE_LIST);
    const modList = JSON.parse(peopleList || 'null') || [];
    const lastID = modList[modList.length - 1];
    return lastID ? lastID.personID : 0;
  }
  return 0;
}

export function deletePerson(personID) {
  if (typeof (localStorage) !== 'undefined') {
    const peopleList = localStorage.getItem(PEOPLE_LIST);
    const modList = JSON.parse(peopleList || 'null') || [];
    const newList = modList.filter(person => person.personID !== personID);
    localStorage.setItem(PEOPLE_LIST, JSON.stringify(newList));
  }
}

export function addPersonToPeople(customPerson) {
  if (typeof (localStorage) !== 'undefined') {
    const peopleList = localStorage.getItem(PEOPLE_LIST);
    const parsedPeopleList = JSON.parse(peopleList || 'null') || [];
    parsedPeopleList.push(customPerson);
    localStorage.setItem(PEOPLE_LIST, JSON.stringify(parsedPeopleList));
  }
}