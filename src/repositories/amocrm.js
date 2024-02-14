import environments from "../config/environments.js";
import axios from "axios";
import catchFn from "../utils/catch.js";
import { getTokens } from "../services/get-tokens.js";
import { getModmeGroups } from "./modme.js";


export async function getAmocrmGroups() {
  try {
    const { DOMAIN } = environments;
    const axiosForCustomField = async (token) => {
      const groups = await axios.get(`${DOMAIN}/api/v4/leads/custom_fields`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const group_custom_field = groups.data._embedded.custom_fields.find(
        (el) => el.id == 226568 || el.name == "Guruh"
      );

      return group_custom_field;
    };

    let group_custom_field = await axiosForCustomField(
      (
        await getTokens()
      ).amo_access
    );
    return group_custom_field ? group_custom_field.enums : [];
  } catch (error) {
    catchFn(error, "Error with get amocrm groups");
  }
}

export async function editGroupsAmocrm(enums, access_token, id) {
    try {
        const { DOMAIN } = environments;
        await axios.patch(
          `${DOMAIN}/api/v4/leads/custom_fields/${id}`,
          {
            enums,
          },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
          }
        );
    } catch (error) {
        catchFn(error, 'Error with edit amocrm groups')
    };
}

export const getAmoStudent = async (req, res) => {
  try {
    const { DOMAIN } = environments;
    let { amo_access } = await getTokens();
    const { leads } = req.body;
    if (leads.status) {
      let id = leads.status[0].id;
      const lead = await axios.get(`${DOMAIN}/api/v4/leads/${id}`, {
        headers: {
          Authorization: `Bearer ${amo_access}`,
        },
        params: { with: "contacts" },
      });
      const contact = await axios.get(
        `${DOMAIN}/api/v4/contacts/${lead.data._embedded.contacts[0].id}`,
        {
          headers: {
            Authorization: `Bearer ${amo_access}`,
          },
        }
      );
      const objLead = {};
      objLead.phones = contact.data.custom_fields_values[0].values.map(
        (item) => ({ value: item.value, name: "phone" })
      );
      objLead.name = contact.data.name;
      for (let item of lead.data.custom_fields_values) {
        if (item.field_name == "Guruh") {
          objLead.group = item.values[0].value;
        } else if(item.field_name=='added_date'){
          objLead.added_date = item.values[0].value;
        }else if(item.field_name=='activated_date'){
            objLead.activated_date = item.values[0].value;
        }
      }
      let modmeGroups=await getModmeGroups()
      let found = modmeGroups.some(function (element) {
        return element.code === objLead.group;
      });
      if (objLead.group && objLead.activated_date && objLead.phones && objLead.name && objLead.added_date && found ) {
        return objLead;
      } else {
        await axios.patch(
          `${DOMAIN}/api/v4/leads/${leads.status[0].id}`,
          {
            status_id: +leads.status[0].old_status_id,
          },
          {
            headers: {
              Authorization: `Bearer ${amo_access}`,
            },
          }
        );
        return null;
      }
    }
  } catch (error) {
    catchFn(error, 'Error with get amo student')
  }
};

export const mountStudentData=async (req,res)=>{
    try {
      let studentData = await getAmoStudent(req, res);
      if (studentData == null) {
        return null;
      }
      let data = studentData.phones
        .map((item) => {
          if (
            /^(\+998|998)?(3{2}|7{2}|8{2}|2{2}|5{2}|(9[013-57-9]))\d{7}$/.test(
              item.value
            )
          ) {
            return { value: item.value.slice(-9), name: "phone" };
          }
        })
        .filter((el) => el != undefined);
      studentData.phones = data;
      return studentData
    } catch (error) {
      catchFn(error, "Error with mount student data");
    }
}




