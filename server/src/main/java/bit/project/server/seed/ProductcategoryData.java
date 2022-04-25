package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class ProductcategoryData extends AbstractSeedClass {

    public ProductcategoryData(){
        addIdNameData(1, "Bedroom");
        addIdNameData(2, "Living Room");
        addIdNameData(3, "Dining Room");
        addIdNameData(4, "Office");
    }

}