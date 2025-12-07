import { Router } from "express";
import { genericController } from "../../../application/controllers/genericController.ts";
import { tableDefs } from "../../../src/tableDefs.ts";

export const genericRouter = Router();

for (const tableDef of tableDefs) {
    if (tableDef.requiereRuta) {
        const {
            getAllRows,
            createRow,
            getRow,
            updateRow,
            deleteRow
        } = genericController(tableDef);

        genericRouter.get("/" + tableDef.name + "/all", getAllRows);
        genericRouter.post("/" + tableDef.name + "/create", createRow);
        genericRouter.get("/" + tableDef.name + "/:id", getRow);
        genericRouter.post("/" + tableDef.name + "/update", updateRow);
        genericRouter.delete("/" + tableDef.name + "/delete", deleteRow);

        for (const pk of tableDef.pk) {
            genericRouter.post(`/${tableDef.name}/update/${pk}/:${pk}`, updateRow);
            genericRouter.post(`/${tableDef.name}/delete/${pk}/:${pk}`, deleteRow);
            genericRouter.get(`/${tableDef.name}/get/${pk}/:${pk}`, getRow);
        }
    }
}
