package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class CustomerrefundInsert extends Trigger{

    @Override
    public String getName() {
        return "customerrefund_insert";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_INSERT;
    }

    @Override
    public String getTableName() {
        return "customerrefund";
    }

    public CustomerrefundInsert(){
        addBodyLine("    update customerorder set balance = balance + NEW.amount where id = NEW.customerorder_id;");
    }

}