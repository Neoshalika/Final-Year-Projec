package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class SupplierreturnUpdate extends Trigger{

    @Override
    public String getName() {
        return "supplierreturn_update";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_UPDATE;
    }

    @Override
    public String getTableName() {
        return "supplierreturn";
    }

    public SupplierreturnUpdate(){
    }

}