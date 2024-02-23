import axios from "axios";
import { getTokens } from "../services/get-tokens.js";
import environments from "../config/environments.js";
import catchFn from "../utils/catch.js";
import { getAmocrmGroups, editGroupsAmocrm } from "../repositories/amocrm.js";
import { getModmeGroups } from "../repositories/modme.js";




export const groupsSync = async () => {
  try {
    const { DOMAIN } = environments;
    const { amo_access } = await getTokens();
    let amoGroups = await getAmocrmGroups();
    let modmeGroups = await getModmeGroups();
    const valuesFromAmocrm = new Set(amoGroups.map((item) => item.value));
    const valuesFromModme = new Set(modmeGroups.map((item) => item.name));
    const namesNotInAmoCrm = modmeGroups
      .map((item) => item.name)
      .filter((name) => !valuesFromAmocrm.has(name));

    const axiosForCustomField = async () => {
      const groups = await axios.get(`${DOMAIN}/api/v4/leads/custom_fields`, {
        headers: {
          Authorization: `Bearer ${amo_access}`,
        },
      });

      const group_custom_field = groups.data._embedded.custom_fields.find(
        (el) => el.id == 226568 || el.name == "group"
      );

      return group_custom_field;
    };

    const axiosForCustomFieldsDate = async () => {
      const groups = await axios.get(`${DOMAIN}/api/v4/leads/custom_fields`, {
        headers: {
          Authorization: `Bearer ${amo_access}`,
        },
      });

      const add_custom_field = groups.data._embedded.custom_fields.find(
        (el) => el.id == 226568 || el.name == "added_date"
      );

      const active_custom_field = groups.data._embedded.custom_fields.find(
        (el) => el.id == 226568 || el.name == "activated_date"
      );


      return {
        add_custom_field,
        active_custom_field
      };
    };

    const custom_filed = await axiosForCustomField();
    let {add_custom_field, active_custom_field}=await axiosForCustomFieldsDate()
    async function add_custom(name) {
      await axios.post(
        `${DOMAIN}/api/v4/leads/custom_fields`,
        {
          name: name,
          type: 'date',
          required_statuses: null,
        },
        {
          headers: {
            Authorization: `Bearer ${amo_access}`,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if(!add_custom_field){
      await add_custom('added_date')
    }

    if(!active_custom_field){
      await add_custom("activated_date");
    }

    if (!custom_filed) {
      await axios.post(
        `${DOMAIN}/api/v4/leads/custom_fields`,
        {
          name: "group",
          type: "select",
          required_statuses: null,
          enums: namesNotInAmoCrm.map((value) => ({ value })),
        },
        {
          headers: {
            Authorization: `Bearer ${amo_access}`,
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      if (custom_filed.enums.length == 0) {
        await editGroupsAmocrm(
          namesNotInAmoCrm.map((value) => ({ value })),
          amo_access,
          custom_filed.id
        );
      } else {
        await editGroupsAmocrm(
          [
            ...custom_filed.enums,
            ...namesNotInAmoCrm.map((value) => ({ value })),
          ],
          amo_access,
          custom_filed.id
        );
        amoGroups = await getAmocrmGroups();
        const namesNotInModme = amoGroups
          .map((item) => item.value)
          .filter((value) => !valuesFromModme.has(value));
        await editGroupsAmocrm(
          [
            ...amoGroups.filter(
              (item) => !namesNotInModme.includes(item.value)
            ),
          ],
          amo_access,
          custom_filed.id
        );
      }
    }
    process.gr_sy = true;
  } catch (error) {
   catchFn(error, "Error with groups sync");
  }
};

