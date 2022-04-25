package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class PrmaterialreturnmaterialInsert extends Trigger{

    @Override
    public String getName() {
        return "prmaterialreturnmaterial_insert";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_INSERT;
    }

    @Override
    public String getTableName() {
        return "prmaterialreturnmaterial";
    }

    public PrmaterialreturnmaterialInsert(){
        addBodyLine("    update material set qty = qty + NEW.qty where id = NEW.material_id;");
    }

}