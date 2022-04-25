package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class SupplierpaymentInsert extends Trigger{

    @Override
    public String getName() {
        return "supplierpayment_insert";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_INSERT;
    }

    @Override
    public String getTableName() {
        return "supplierpayment";
    }

    public SupplierpaymentInsert(){
        //addBodyLine("    update purchase set balance = balance - NEW.amount where id = NEW.purchase_id;");
    }

}
