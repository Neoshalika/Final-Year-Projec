package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class SupplierpaymentDelete extends Trigger{

    @Override
    public String getName() {
        return "supplierpayment_delete";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_DELETE;
    }

    @Override
    public String getTableName() {
        return "supplierpayment";
    }

    public SupplierpaymentDelete(){
        //addBodyLine("    update purchase set balance = balance + OLD.amount where id = OLD.purchase_id;");
    }

}
