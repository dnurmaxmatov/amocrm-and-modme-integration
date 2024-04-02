import env from "../../config/env.js";
import axios from "axios";
import getModmeGroups from '../modme/get-groups.js'
import { send_error } from "../error-telegram.js";
import { StatusModel } from "../../models/statuses.js";

export const getAmoStudent = async (req, res, status) => {
    try {
        const { DOMAIN, LONG_TERM_TOKEN } = env;
        const { leads } = req.body;
        if (leads.status) {
            let id = leads.status[0].id;
            if (Number(leads.status[0].old_status_id) !== 142) {
                await StatusModel.deleteMany({ id })
            }
            await StatusModel.create({
                id,
                status: +leads.status[0].old_status_id
            })
            const lead = await axios.get(`${DOMAIN}/api/v4/leads/${id}`, {
                headers: {
                    Authorization: `Bearer ${LONG_TERM_TOKEN}`,
                },
                params: { with: "contacts" },
            });
            const contact = await axios.get(
                `${DOMAIN}/api/v4/contacts/${lead.data._embedded.contacts[0].id}`,
                {
                    headers: {
                        Authorization: `Bearer ${LONG_TERM_TOKEN}`,
                    },
                }
            );
            const objLead = {};
            objLead.phones = contact.data.custom_fields_values[0].values.map(
                (item) => ({ value: item.value, name: "phone" })
            );
            objLead.name = contact.data.name;
            if (lead.data.custom_fields_values) {
                for (let item of lead.data.custom_fields_values) {
                    if (item.field_name == "group") {
                        objLead.group = item.values[0].value;
                    } else if (item.field_name == 'added_date') {
                        objLead.added_date = item.values[0].value;
                    } else if (item.field_name == 'activated_date') {
                        objLead.activated_date = item.values[0].value;
                    }
                }
            }
            let modmeGroups = await getModmeGroups()
            let found = modmeGroups.some(function (element) {
                return element.code === objLead.group;
            });
            if (objLead.group && objLead.phones && objLead.name && (status == 'activate' ? objLead.activated_date : objLead.added_date) && found) {
                return objLead;
            } else {
                if (status == 'activate' && !objLead.added_date && !objLead.group && !found) {
                    const first_status = await StatusModel.findOne({ id }).sort({ _id: 1 })
                    const st_change = await axios.patch(
                        `${DOMAIN}/api/v4/leads/${leads.status[0].id}`,
                        {
                            status_id: Number(first_status.status)
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${LONG_TERM_TOKEN}`,
                            },
                        }
                    );


                    if (st_change) {
                        await StatusModel.deleteMany({ id })
                    }
                    return null
                }
                await axios.patch(
                    `${DOMAIN}/api/v4/leads/${leads.status[0].id}`,
                    {
                        status_id: +leads.status[0].old_status_id,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${LONG_TERM_TOKEN}`,
                        },
                    }
                );


                return null;
            }
        }
    } catch (error) {
        send_error(error, "ERROR_WITH_GET_AMOCRM_STUDENT")
    }
};
