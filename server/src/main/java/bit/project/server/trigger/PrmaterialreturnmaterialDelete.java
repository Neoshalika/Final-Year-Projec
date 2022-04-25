package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class PrmaterialreturnmaterialDelete extends Trigger{

    @Override
    public String getName() {
        return "prmaterialreturnmaterial_delete";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_DELETE;
    }

    @Override
    public String getTableName() {
        return "prmaterialreturnmaterial";
    }

    public PrmaterialreturnmaterialDelete(){
        addBodyLine("    update material set qty = qty - OLD.qty where id = OLD.material_id;");
    }

}