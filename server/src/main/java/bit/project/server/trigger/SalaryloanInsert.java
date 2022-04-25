package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class SalaryloanInsert extends Trigger{

    @Override
    public String getName() {
        return "salaryloan_insert";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_INSERT;
    }

    @Override
    public String getTableName() {
        return "salaryloan";
    }

    public SalaryloanInsert(){
        addBodyLine("    update loan set balance = balance - NEW.amount where id = NEW.loan_id;");
    }

}