package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class PrordermaterialUpdate extends Trigger{

    @Override
    public String getName() {
        return "prordermaterial_update";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_UPDATE;
    }

    @Override
    public String getTableName() {
        return "prordermaterial";
    }

    public PrordermaterialUpdate(){
        addBodyLine("    DECLARE deference decimal(13,3) DEFAULT 0;");
        addBodyLine("");
        addBodyLine("    IF OLD.material_id = NEW.material_id THEN");
        addBodyLine("        IF OLD.qty != NEW.qty THEN");
        addBodyLine("            SET deference = OLD.qty - NEW.qty;");
        addBodyLine("            update material set qty = qty + deference where id = NEW.material_id;");
        addBodyLine("        END IF;");
        addBodyLine("    END IF;");
        addBodyLine("");
        addBodyLine("    IF OLD.material_id != NEW.material_id THEN");
        addBodyLine("        update material set qty = qty + OLD.qty where id = OLD.material_id;");
        addBodyLine("        update material set qty = qty - NEW.qty where id = NEW.material_id;");
        addBodyLine("    END IF;");
    }

}