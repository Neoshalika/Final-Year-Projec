package bit.project.server.dao;

import bit.project.server.entity.Purchase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported=false)
public interface PurchaseDao extends JpaRepository<Purchase, Integer>{
    @Query("select new Purchase (p.id,p.code,p.supplier,p.porder) from Purchase p")
    Page<Purchase> findAllBasic(PageRequest pageRequest);

    @Query("select p from Purchase p where p.supplier.id =:id and p.purchaseSupplierpaymentList.size = 0")
    List<Purchase> getAllBySupplierForPayment(@Param("id") Integer id);

    Purchase findByCode(String code);
}
