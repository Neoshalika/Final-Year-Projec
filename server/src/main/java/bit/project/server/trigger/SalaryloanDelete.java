package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class SalaryloanDelete extends Trigger{

    @Override
    public String getName() {
        return "salaryloan_delete";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_DELETE;
    }

    @Override
    public String getTableName() {
        return "salaryloan";
    }

    public SalaryloanDelete(){
        addBodyLine("    update loan set balance = balance + OLD.amount where id = OLD.loan_id;");
    }

}