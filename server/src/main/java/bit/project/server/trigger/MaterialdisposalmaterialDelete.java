package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class MaterialdisposalmaterialDelete extends Trigger{

    @Override
    public String getName() {
        return "materialdisposalmaterial_delete";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_DELETE;
    }

    @Override
    public String getTableName() {
        return "materialdisposalmaterial";
    }

    public MaterialdisposalmaterialDelete(){
        addBodyLine("    update material set qty = qty + OLD.qty where id = OLD.material_id;");
    }

}