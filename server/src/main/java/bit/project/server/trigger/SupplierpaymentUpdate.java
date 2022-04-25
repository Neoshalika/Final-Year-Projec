package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class SupplierpaymentUpdate extends Trigger{

    @Override
    public String getName() {
        return "supplierpayment_update";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_UPDATE;
    }

    @Override
    public String getTableName() {
        return "supplierpayment";
    }

    public SupplierpaymentUpdate(){
//        addBodyLine("");
//        addBodyLine("    DECLARE deference decimal(10,2) DEFAULT 0;");
//        addBodyLine("");
//        addBodyLine("    IF OLD.purchase_id != NEW.purchase_id THEN");
//        addBodyLine("");
//        addBodyLine("        update purchase set balance = balance + OLD.amount where id = OLD.purchase_id;");
//        addBodyLine("");
//        addBodyLine("        IF NEW.paymentstatus_id != 3 THEN");
//        addBodyLine("            update purchase set balance = balance - NEW.amount where id = NEW.purchase_id;");
//        addBodyLine("        END IF;");
//        addBodyLine("");
//        addBodyLine("    END IF;");
//        addBodyLine("");
//        addBodyLine("    IF OLD.purchase_id = NEW.purchase_id THEN");
//        addBodyLine("");
//        addBodyLine("        IF OLD.amount != NEW.amount THEN");
//        addBodyLine("            SET deference = OLD.amount - NEW.amount;");
//        addBodyLine("            update purchase set balance = balance + deference where id = NEW.purchase_id;");
//        addBodyLine("        END IF;");
//        addBodyLine("");
//        addBodyLine("        IF OLD.paymentstatus_id = 2 AND NEW.paymentstatus_id = 3 THEN");
//        addBodyLine("            update purchase set balance = balance + NEW.amount where id = NEW.purchase_id;");
//        addBodyLine("        END IF;");
//        addBodyLine("");
//        addBodyLine("        IF OLD.paymentstatus_id = 3 AND NEW.paymentstatus_id = 2 THEN");
//        addBodyLine("            update purchase set balance = balance - NEW.amount where id = NEW.purchase_id;");
//        addBodyLine("        END IF;");
//        addBodyLine("");
//        addBodyLine("    END IF;");
    }

}
