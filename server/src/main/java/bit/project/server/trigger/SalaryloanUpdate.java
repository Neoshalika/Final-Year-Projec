package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class SalaryloanUpdate extends Trigger{

    @Override
    public String getName() {
        return "salaryloan_update";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_UPDATE;
    }

    @Override
    public String getTableName() {
        return "salaryloan";
    }

    public SalaryloanUpdate(){
        addBodyLine("    DECLARE deference decimal(10,2) DEFAULT 0;");
        addBodyLine("");
        addBodyLine("    IF OLD.loan_id != NEW.loan_id THEN");
        addBodyLine("");
        addBodyLine("        update loan set balance = balance - NEW.amount where id = NEW.loan_id;");
        addBodyLine("        update loan set balance = balance + OLD.amount where id = OLD.loan_id;");
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
        addBodyLine("    END IF;");
    }

}