package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class SupplierreturnstatusData extends AbstractSeedClass {

    public SupplierreturnstatusData(){
        addIdNameData(1, "Returned");
        addIdNameData(2, "Received");
    }

}