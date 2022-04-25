package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class LoanrepaymentDelete extends Trigger{

    @Override
    public String getName() {
        return "loanrepayment_delete";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_DELETE;
    }

    @Override
    public String getTableName() {
        return "loanrepayment";
    }

    public LoanrepaymentDelete(){
        addBodyLine("    update loan set balance = balance + OLD.amount where id = OLD.loan_id;");
    }

}