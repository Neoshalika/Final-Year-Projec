package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class CustomerpaymentUpdate extends Trigger{

    @Override
    public String getName() {
        return "customerpayment_update";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_UPDATE;
    }

    @Override
    public String getTableName() {
        return "customerpayment";
    }

    public CustomerpaymentUpdate(){
        addBodyLine("");
        addBodyLine("    DECLARE deference decimal(10,2) DEFAULT 0;");
        addBodyLine("");
        addBodyLine("    IF OLD.customerorder_id != NEW.customerorder_id THEN");
        addBodyLine("");
        addBodyLine("        update customerorder set balance = balance + OLD.amount where id = OLD.customerorder_id;");
        addBodyLine("");
        addBodyLine("        IF NEW.paymentstatus_id != 3 THEN");
        addBodyLine("            update customerorder set balance = balance - NEW.amount where id = NEW.customerorder_id;");
        addBodyLine("        END IF;");
        addBodyLine("");
        addBodyLine("    END IF;");
        addBodyLine("");
        addBodyLine("    IF OLD.customerorder_id = NEW.customerorder_id THEN");
        addBodyLine("");
        addBodyLine("        IF OLD.amount != NEW.amount THEN");
        addBodyLine("            SET deference = OLD.amount - NEW.amount;");
        addBodyLine("            update customerorder set balance = balance + deference where id = NEW.customerorder_id;");
        addBodyLine("        END IF;");
        addBodyLine("");
        addBodyLine("        IF OLD.paymentstatus_id = 2 AND NEW.paymentstatus_id = 3 THEN");
        addBodyLine("            update customerorder set balance = balance + NEW.amount where id = NEW.customerorder_id;");
        addBodyLine("        END IF;");
        addBodyLine("");
        addBodyLine("        IF OLD.paymentstatus_id = 3 AND NEW.paymentstatus_id = 2 THEN");
        addBodyLine("            update customerorder set balance = balance - NEW.amount where id = NEW.customerorder_id;");
        addBodyLine("        END IF;");
        addBodyLine("");
        addBodyLine("    END IF;");
    }

}