import getModmeGroups from '../services/modme/get-groups.js'
import getAmoCrmGroups from '../services/amocrm/get-groups.js'
import editGroupsAmocrm from '../services/amocrm/edit-groups.js'
import env from '../config/env.js'
import axios from 'axios'
import { send_error } from '../services/error-telegram.js'

export default async () => {
    try {
        const { DOMAIN, LONG_TERM_TOKEN } = env

        let amoGroups = await getAmoCrmGroups();
        let modmeGroups = await getModmeGroups();

        const valuesFromAmocrm = new Set(amoGroups.map((item) => item.value));
        const valuesFromModme = new Set(modmeGroups.map((item) => item.name));
        const namesNotInAmoCrm = modmeGroups
            .map((item) => item.name)
            .filter((name) => !valuesFromAmocrm.has(name));

        const custom_filds = await axios.get(`${DOMAIN}/api/v4/leads/custom_fields`, {
            headers: {
                Authorization: `Bearer ${LONG_TERM_TOKEN}`
            }
        })

        const group_custom_filed = custom_filds.data._embedded.custom_fields.find(el => el.name == "group");
        const add_custom_field = custom_filds.data._embedded.custom_fields.find((el) => el.name == "added_date");
        const active_custom_field = custom_filds.data._embedded.custom_fields.find(el => el.name == "activated_date");

        async function add_custom(options) {
            await axios.post(`${DOMAIN}/api/v4/leads/custom_fields`, options, {
                headers: {
                    Authorization: `Bearer ${LONG_TERM_TOKEN}`,
                    "Content-Type": "application/json"
                }
            })
        }

        if (!add_custom_field) {
            await add_custom({
                name: 'added_date',
                type: 'date',
                required_statuses: null,
            })
        }

        if (!active_custom_field) {
            await add_custom({
                name: 'activated_date',
                type: 'date',
                required_statuses: null,
            })
        }

        if (!group_custom_filed) {
            await add_custom({
                name: "group",
                type: "select",
                required_statuses: null,
                enums: namesNotInAmoCrm.map((value) => ({ value })),
            })
        } else {
            if (group_custom_filed.enums.length === 0) {
                await editGroupsAmocrm(
                    namesNotInAmoCrm.map((value) => ({ value })),
                    group_custom_filed.id
                );
            } else {
                await editGroupsAmocrm(
                    [
                        ...group_custom_filed.enums,
                        ...namesNotInAmoCrm.map((value) => ({ value })),
                    ],
                    group_custom_filed.id
                )

                amoGroups = await getAmoCrmGroups()

                const namesNotInModme = amoGroups
                    .map((item) => item.value)
                    .filter((value) => !valuesFromModme.has(value));

                await editGroupsAmocrm(
                    [
                        ...amoGroups.filter(
                            (item) => !namesNotInModme.includes(item.value)
                        ),
                    ],
                    group_custom_filed.id
                );
            }
        }
    } catch (error) {
        send_error(error.message, "ERROR_WITH_GROUPS_SYNC")
    }

}