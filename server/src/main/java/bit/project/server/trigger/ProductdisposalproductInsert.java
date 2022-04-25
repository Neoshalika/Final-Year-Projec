package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class ProductdisposalproductInsert extends Trigger{

    @Override
    public String getName() {
        return "productdisposalproduct_insert";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_INSERT;
    }

    @Override
    public String getTableName() {
        return "productdisposalproduct";
    }

    public ProductdisposalproductInsert(){
        addBodyLine("    update product set qty = qty - NEW.qty where id = NEW.product_id;");
    }

}