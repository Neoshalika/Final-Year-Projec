package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class CustomerrefundproductInsert extends Trigger{

    @Override
    public String getName() {
        return "customerrefundproduct_insert";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_INSERT;
    }

    @Override
    public String getTableName() {
        return "customerrefundproduct";
    }

    public CustomerrefundproductInsert(){
        addBodyLine("    update product set qty = qty + NEW.qty where id = NEW.product_id;");
    }

}