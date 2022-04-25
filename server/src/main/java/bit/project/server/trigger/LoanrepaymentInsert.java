package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class LoanrepaymentInsert extends Trigger{

    @Override
    public String getName() {
        return "loanrepayment_insert";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_INSERT;
    }

    @Override
    public String getTableName() {
        return "loanrepayment";
    }

    public LoanrepaymentInsert(){
        addBodyLine("    update loan set balance = balance - NEW.amount where id = NEW.loan_id;");
    }

}