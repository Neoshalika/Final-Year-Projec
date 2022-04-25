package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class PrordermaterialDelete extends Trigger{

    @Override
    public String getName() {
        return "prordermaterial_delete";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_DELETE;
    }

    @Override
    public String getTableName() {
        return "prordermaterial";
    }

    public PrordermaterialDelete(){
        addBodyLine("    update material set qty = qty + OLD.qty where id = OLD.material_id;");
    }

}