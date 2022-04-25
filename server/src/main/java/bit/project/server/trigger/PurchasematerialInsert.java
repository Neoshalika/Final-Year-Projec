package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class PurchasematerialInsert extends Trigger{

    @Override
    public String getName() {
        return "purchasematerial_insert";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_INSERT;
    }

    @Override
    public String getTableName() {
        return "purchasematerial";
    }

    public PurchasematerialInsert(){
        addBodyLine("    update material set qty = qty + NEW.qty where id = NEW.material_id;");
    }

}