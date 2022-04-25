package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class LoanrepaymentUpdate{

    /*@Override
    public String getName() {
        return "loanrepayment_update";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_UPDATE;
    }

    @Override
    public String getTableName() {
        return "loanrepayment";
    }

    public LoanrepaymentUpdate(){
        addBodyLine("    DECLARE deference decimal(10,2) DEFAULT 0;");
        addBodyLine("");
        addBodyLine("    IF OLD.loan_id != NEW.loan_id THEN");
        addBodyLine("");
        addBodyLine("        update loan set balance = balance + OLD.amount where id = OLD.loan_id;");
        addBodyLine("");
        addBodyLine("        IF NEW.paymentstatus_id != 3 THEN");
        addBodyLine("            update loan set balance = balance - NEW.amount where id = NEW.loan_id;");
        addBodyLine("        END IF;");
        addBodyLine("");
        addBodyLine("    END IF;");
        addBodyLine("");
        addBodyLine("    IF OLD.loan_id = NEW.loan_id THEN");
        addBodyLine("");
        addBodyLine("        IF OLD.amount != NEW.amount THEN");
        addBodyLine("            SET deference = OLD.amount - NEW.amount;");
        addBodyLine("            update loan set balance = balance + deference where id = NEW.loan_id;");
        addBodyLine("        END IF;");
        addBodyLine("");
        addBodyLine("        IF OLD.paymentstatus_id = 2 AND NEW.paymentstatus_id = 3 THEN");
        addBodyLine("            update loan set balance = balance + NEW.amount where id = NEW.loan_id;");
        addBodyLine("        END IF;");
        addBodyLine("");
        addBodyLine("        IF OLD.paymentstatus_id = 3 AND NEW.paymentstatus_id = 2 THEN");
        addBodyLine("            update loan set balance = balance - NEW.amount where id = NEW.loan_id;");
        addBodyLine("        END IF;");
        addBodyLine("");
        addBodyLine("    END IF;");
    }*/

}
