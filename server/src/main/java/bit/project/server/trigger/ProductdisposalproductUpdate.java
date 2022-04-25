package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class ProductdisposalproductUpdate extends Trigger{

    @Override
    public String getName() {
        return "productdisposalproduct_update";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_UPDATE;
    }

    @Override
    public String getTableName() {
        return "productdisposalproduct";
    }

    public ProductdisposalproductUpdate(){
        addBodyLine("    DECLARE deference int(11) DEFAULT 0;");
        addBodyLine("");
        addBodyLine("    IF OLD.product_id = NEW.product_id THEN");
        addBodyLine("        IF OLD.qty != NEW.qty THEN");
        addBodyLine("            SET deference = OLD.qty - NEW.qty;");
        addBodyLine("            update product set qty = qty + deference where id = NEW.product_id;");
        addBodyLine("        END IF;");
        addBodyLine("    END IF;");
        addBodyLine("");
        addBodyLine("    IF OLD.product_id != NEW.product_id THEN");
        addBodyLine("        update product set qty = qty + OLD.qty where id = OLD.product_id;");
        addBodyLine("        update product set qty = qty - NEW.qty where id = NEW.product_id;");
        addBodyLine("    END IF;");
    }

}