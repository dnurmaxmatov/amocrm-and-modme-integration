import environments from "../config/environments.js";
import axios from "axios";
import catchFn from "../utils/catch.js";
import { getTokens } from "../services/get-tokens.js";
import mt from 'moment'

export const restoreFromTrash = async (studentId) => {
  try {
    const { modme_token } = await getTokens();
    await axios.post(
      `${environments.DOMAIN_MODME}/v1/user/restore/multiple?branch_id=318&user_ids[]=${studentId}&restore_all=false`,
      null,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,uz;q=0.7",
          authorization: `Bearer ${modme_token}`,
          "sec-ch-ua":
            '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
          Referer: `${environments.MODME_REFERER}/archive/list/all`,
          "Referrer-Policy": "unsafe-url",
        },
      }
    );
    return studentId;
  } catch (error) {
    catchFn(error, "Error with restore");
  }
};



export async function getModmeGroups() {
  try {
    const { DOMAIN_MODME } = environments;
    const { modme_token } = await getTokens();

    const groups = await axios.get(
      `${DOMAIN_MODME}/v1/group?branch_id=${environments.BRANCH_ID}&status=2`,
      {
        headers: {
          Authorization: `Bearer ${modme_token}`,
          Referer: environments.MODME_REFERER,
        },
      }
    );

    return groups.data ? groups.data : [];
  } catch (error) {
    catchFn(error, "Error with get modme groups");
  }
}

export const getStudentList = async (studentData) => {
  try {
    const { modme_token } = await getTokens();
    const nameArray = studentData.name.toUpperCase().split(" ").sort();
    let studentID = null;
    let student = await axios.get(
      `${environments.DOMAIN_MODME}/v1/user?user_type=student&per_page=50&page=1&name_or_phone=${studentData?.phones[0].value}&branch_id=${environments.BRANCH_ID}`,
      {
        headers: {
          Authorization: `Bearer ${modme_token}`,
          Referer: environments.MODME_REFERER,
        },
      }
    );
    if (student.data.data && student.data.pagination) {
      for (let item of student.data.data) {
        let nameArrayItem = item.name.toUpperCase().split(" ").sort();
        if (arraysAreEqual(nameArrayItem, nameArray)) {
          studentID = item.id;
          break;
        }
      }
    }

    return studentID;
  } catch (error) {
    catchFn(error, "Error with search for student");
  }
};

export const searchFromTrash = async (studentData) => {
  try {
    const { modme_token } = await getTokens();
    const nameArray = studentData.name.toUpperCase().split(" ").sort();
    let studentID = null;
    let student = await axios.get(
      `${environments.DOMAIN_MODME}/v1/company/303/users/trashed?company_id=${environments.COMPANY_ID}&per_page=50&name_or_phone=${studentData.phones[0].value}&page=1`,
      {
        headers: {
          Authorization: `Bearer ${modme_token}`,
          Referer: environments.MODME_REFERER,
        },
      }
    );
    if (student.data.data && student.data.pagination) {
      for (let item of student.data.data) {
        let nameArrayItem = item.name.toUpperCase().split(" ").sort();
        if (arraysAreEqual(nameArrayItem, nameArray)) {
          studentID = item.id;
          break;
        }
      }
    }

    return studentID;
  } catch (error) {
    catchFn(error, "Error with search for student");
  }
};

export const findGroupId = async (group) => {
  try {
    const groups = await getModmeGroups();
    let id = null;
    groups.some(function (element) {
      if (element.code == group) {
        id = element.id;
      }
    });

    return id;
  } catch (error) {
    catchFn(error, "Error with find group id");
  }
};

export const checkExistsInGroup = async (groupId, studentId, added_date) => {
  try {
    const {modme_token}=await getTokens()
    let students = await axios.get(
      `${environments.DOMAIN_MODME}/v1/group/${groupId}/students?all=1`,
      {
        headers: {
          Authorization: `Bearer ${modme_token}`,
          Referer: environments.MODME_REFERER
        }
      }
    );
    let student = students.data.find((el) => el.id == studentId);
    if (!student) {
      await addToGroup(groupId, studentId, added_date);
    }
    return true;
  } catch (error) {
    catchFn(error, "Error with check exists in group");
  }
};

export const addToGroup = async (groupId, studentId, added_date) => {
  try {
    const { modme_token } = await getTokens();
    const added_format = mt.unix(added_date).format("YYYY-MM-DD");
    await axios.post(
      `${environments.DOMAIN_MODME}/v1/group/${groupId}/students/${studentId}`,
      {
        created_date: added_format,
      },
      {
        headers: {
          Authorization: `Bearer ${modme_token}`,
          Referer: environments.MODME_REFERER,
        },
      }
    );
  } catch (error) {
    catchFn(error, "Error with add to group");
  }
};

export const createStudent = async (data) => {
  try {
    const { modme_token } = await getTokens();
    const { DOMAIN_MODME, BRANCH_ID, COMPANY_ID, MODME_REFERER } = environments;
    let student = await axios.post(
      `${DOMAIN_MODME}/v1/user`,
      {
        datas: {
          contacts: [...data.phones.slice(1)],
        },
        phone: `${data.phones[0].value}`,
        name: data.name,
        password: `${data.phones[0].value}`,
        user_type: "student",
        branch: {
          id: `${BRANCH_ID}`,
          main: 1,
        },
        branch_id: `${BRANCH_ID}`,
        company_id: COMPANY_ID,
        relation_degree: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${modme_token}`,
          Referer: MODME_REFERER,
        },
      }
    );
    return student.data.id;
  } catch (error) {
    catchFn(error, "Error with create student");
  }
};

export const activateStudent = async (groupId, studentId, activated_date) => {
  try {
    const { modme_token } = await getTokens();
    const activated_format = mt.unix(activated_date).format("YYYY-MM-DD");
    await axios.put(
      `${environments.DOMAIN_MODME}/v1/group/${groupId}/student/${studentId}/5`,
      {
        status: 5,
        type: "activation",
        activated_date: activated_format,
      },
      {
        headers: {
          Authorization: `Bearer ${modme_token}`,
          Referer: environments.MODME_REFERER,
        },
      }
    );
  } catch (error) {
    catchFn(error, "Error with activate student");
  }
};

function arraysAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every((value, index) => value === arr2[index]);
}








